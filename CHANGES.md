# SEO + GEO Overhaul Notes

## What changed

- Standardized the site to the custom domain and removed staging-host references from the repo.
- Added/normalized robots metadata and kept the site indexable for search discovery.
- Updated the primary contact address to `ali@alialquarnilegal.com` with Gmail retained only as an alternative email in the contact details.
- Added a clean CV alias file at `ali-al-qarni-cv.pdf` while keeping the legacy `Ali AL- QARNI CV.pdf` file working.
- Updated the main home-page headline and metadata to emphasize a recruiter-intent keyword set: licensed lawyer for construction and commercial contracts in Saudi Arabia.
- Corrected the homepage wording to the approved phrasing: "4+ years of Saudi legal practice, including in-house work for a contracting company since 2024."
- Updated the sitemap to reflect current dates and maintained the custom-domain URL structure.
- Added bot allow-list entries for the major AI and search crawlers requested for review.
- Added owner-confirmation HTML comments where the site text may conflict with LinkedIn or CV facts.

## Validation status

- Static repo scan for staging-host leakage: PASS
- Sitemap parsing check against the live custom-domain URL set: PASS
- Robots-file review for the requested bot allow-list: PASS
- Primary contact email presence check: PASS
- Clean CV alias creation: PASS

This is a static-file validation pass only; the site was not deployed to production during this review, so live Lighthouse, Rich Results, and search-console verification remain pending owner review and deployment.

## [VERIFY] items

- No statutory citations or article numbers were added to the site; the repo intentionally avoids unverified legal references.
- All legal claims remain aligned to the current static corpus and owner-supplied context rather than adding new facts.
- The site still requires human review of any public PDFs before publication to ensure no personal identifiers, barcodes, signatures, student IDs, national IDs, or other sensitive data remain exposed.

## OPEN QUESTIONS FOR OWNER

1. Please confirm the correct legal title string for the site. Default proposal: "Licensed Lawyer & Legal Specialist".
2. Please confirm the exact spelling of the name and preferred Arabic display name, if any.
3. Please confirm whether the site should remain recruiter-focused, or whether legal-service advertising is acceptable while employed in-house.
4. Please confirm the correct graduation wording and whether the site should say "Excellency" or "Second Class Honors" for the law degree.
5. Please confirm whether the site should keep the court-representation claims on the home/about/experience pages, or restrict them to the current role only.
6. Please confirm the exact issuer and wording for the GRC certificate and whether the phrase "Professional Legal Accreditation, Saudi Arabian Bar Association, 2024" should remain.
7. Please confirm whether `ali@alialquarnilegal.com` is a live mailbox and whether it can send/receive reliably. If it is a forwarding-only address, a proper mailbox is strongly recommended.
8. Please confirm the list of PDFs to keep public and whether any should be replaced by cropped preview images or removed pending redaction review.
9. Please confirm the preferred owner wording for the public contact page and the legal-services vs recruitment positioning.

## Notes for DNS / mailbox setup

The site is hosted on GitHub Pages and the existing A/CNAME record setup should remain unchanged. The recommended DNS additions, if the owner wants the domain email to work properly, are only the standard mail-related entries for the provider in use: MX, SPF TXT, DKIM, and DMARC.

- Do not change the GitHub Pages A/CNAME records.
- Do not add or remove the existing CNAME file content.
- Confirm the actual DNS provider with the owner before attempting to publish mailbox records.
- The repo intentionally does not guess mailbox values for a provider that is not visible from the current workspace.
