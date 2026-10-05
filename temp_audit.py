from pathlib import Path
import re, json
from bs4 import BeautifulSoup
from pypdf import PdfReader

root = Path(r'c:\Users\USER\Downloads\ALi Al- Qarni Website')
cv_alias = root / 'ali-al-qarni-cv.pdf'
print('CV_ALIAS_EXISTS', cv_alias.exists())
print('CV_ALIAS_SIZE', cv_alias.stat().st_size if cv_alias.exists() else 'MISSING')
print('CV_SOURCE_FILES', sorted(p.name for p in root.iterdir() if p.is_file() and p.suffix.lower()=='.pdf' and 'cv' in p.name.lower()))

html_files = sorted(root.rglob('*.html'))
missing = []
for f in html_files:
    text = f.read_text(encoding='utf-8', errors='ignore')
    soup = BeautifulSoup(text, 'html.parser')
    for tag in soup.find_all(True):
        for attr in ('href','src','poster'):
            val = tag.get(attr)
            if not val:
                continue
            if val.startswith(('http://','https://','mailto:','tel:','javascript:','#')):
                continue
            ref = val.split('#',1)[0].split('?',1)[0].strip()
            if not ref:
                continue
            if ref.startswith('/'):
                target = (root / ref.lstrip('/')).resolve()
            else:
                target = (f.parent / ref).resolve()
            if not target.exists():
                missing.append({'file': str(f.relative_to(root)), 'attr': attr, 'target': ref})
print('BROKEN_LINKS', len(missing))
for item in missing:
    print(json.dumps(item, ensure_ascii=False))

print('--- INVENTORY ---')
for base in [root, root/'certificates', root/'public']:
    if not base.exists():
        continue
    print('BASE', base.name)
    for p in sorted(base.iterdir(), key=lambda x: x.name.lower()):
        if p.is_file() and p.suffix.lower() != '.html':
            kind = 'image' if p.suffix.lower() in {'.png','.jpg','.jpeg','.svg','.gif','.webp'} else 'pdf' if p.suffix.lower()=='.pdf' else 'other'
            print(f"{p.name}\t{p.stat().st_size}\t{kind}")

pdfs = []
for base in [root, root/'certificates', root/'public']:
    if base.exists():
        pdfs.extend([p for p in base.iterdir() if p.is_file() and p.suffix.lower()=='.pdf'])
seen = set(); unique = []
for p in sorted(pdfs, key=lambda x: x.name.lower()):
    key = str(p.resolve())
    if key not in seen:
        unique.append(p)
        seen.add(key)
print('--- PDF_CHECKS ---')
for p in unique:
    try:
        reader = PdfReader(str(p))
        text = '\n'.join((page.extract_text() or '') for page in reader.pages)
    except Exception as e:
        text = f'PDF_READ_ERROR: {e}'
    print('FILE', p.name)
    print('SIZE', p.stat().st_size)
    print('HAS_10_DIGIT', bool(re.search(r'\b\d{10}\b', text)))
    print('HAS_LICENSE_KEYWORD', bool(re.search(r'(licen[cs]e|license|No\.|رقم الترخيص|رخصة|licence)', text, re.I)))
    print('HAS_DOB', bool(re.search(r'\b(?:\d{1,2}[/-]){2}\d{2,4}\b|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b', text)))
    print('HAS_BARCODE_HINT', any(k in text.lower() for k in ['code128','barcode','ean13','ean-13','pdf417','qrcode','qr code']))
    print('TEXT_PREVIEW', text[:300].replace('\n', ' ')[:300])
    print('---')

rec = root / 'recbfCqsez1GkwLJc.pdf'
print('--- RECBF ---')
print('PATH_EXISTS', rec.exists())
if rec.exists():
    try:
        reader = PdfReader(str(rec))
        text = '\n'.join((page.extract_text() or '') for page in reader.pages)
        print('RECBF_SIZE', rec.stat().st_size)
        print('RECBF_PREVIEW', text[:500].replace('\n', ' '))
    except Exception as e:
        print('RECBF_READ_ERROR', e)

print('--- METADATA_TABLE ---')
for f in html_files:
    text = f.read_text(encoding='utf-8', errors='ignore')
    soup = BeautifulSoup(text, 'html.parser')
    title = soup.title.get_text(' ', strip=True) if soup.title else ''
    desc = ''
    m = soup.find('meta', attrs={'name': re.compile(r'description', re.I)}) or soup.find('meta', attrs={'property': re.compile(r'description', re.I)})
    if m:
        desc = m.get('content', '')
    canonical = ''
    c = soup.find('link', rel=lambda x: bool(x) and 'canonical' in [str(v).lower() for v in (x if isinstance(x, list) else [x])])
    if c:
        canonical = c.get('href', '')
    og = ''
    o = soup.find('meta', attrs={'property': 'og:url'}) or soup.find('meta', attrs={'name': 'og:url'})
    if o:
        og = o.get('content', '')
    h1 = ''
    h = soup.find('h1')
    if h:
        h1 = h.get_text(' ', strip=True)
    robots = ''
    r = soup.find('meta', attrs={'name': 'robots'})
    if r:
        robots = r.get('content', '')
    print(f"{f.relative_to(root)}\t{title}\t{desc}\t{canonical}\t{og}\t{h1}\t{robots}")
