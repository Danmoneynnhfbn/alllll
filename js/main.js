if (window.location.pathname.endsWith('/index.html')) {
  const cleanUrl = window.location.href.replace(/\/index\.html(?=[?#]|$)/, '/');
  window.location.replace(cleanUrl);
}

const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopButton = document.querySelector('.scroll-top');
const contactForm = document.querySelector('.contact-form');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.gtranslateSettings = {
  default_language: 'en',
  languages: ['en', 'ar', 'ur', 'hi', 'bn', 'tl', 'id', 'fr'],
  wrapper_selector: '.gtranslate_wrapper',
  switcher_horizontal_position: 'right',
  switcher_vertical_position: 'bottom',
  float_switcher_open_direction: 'top',
  alt_flags: { en: 'usa' },
};

const languageWidget = document.createElement('div');
languageWidget.className = 'gtranslate_wrapper';
document.body.append(languageWidget);

const languageWidgetScript = document.createElement('script');
languageWidgetScript.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
languageWidgetScript.defer = true;
document.body.append(languageWidgetScript);

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const pageName = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;

  const target = href.split('/').filter(Boolean).pop() || 'index.html';
  if (target === pageName) {
    link.classList.add('is-active');
  }
});

if (scrollTopButton) {
  const toggleScrollButton = () => {
    const shouldShow = window.scrollY > 400;
    scrollTopButton.classList.toggle('is-visible', shouldShow);
  };

  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  toggleScrollButton();

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

const revealTargets = document.querySelectorAll('main > section, .page-hero, .hero, .site-footer');

if (revealTargets.length) {
  revealTargets.forEach((element) => {
    element.classList.add('reveal');
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }
}

function setFieldError(field, message) {
  const fieldGroup = field.closest('.field-group');
  const errorMessage = fieldGroup ? fieldGroup.querySelector('.error-message') : null;

  if (errorMessage) {
    errorMessage.textContent = message;
  }

  field.classList.toggle('is-invalid', Boolean(message));
}

if (contactForm) {
  const formFields = {
    name: contactForm.querySelector('#name'),
    email: contactForm.querySelector('#email'),
    company: contactForm.querySelector('#company'),
    role: contactForm.querySelector('#role'),
    subject: contactForm.querySelector('#subject'),
    message: contactForm.querySelector('#message')
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field) => {
    const value = field.value.trim();

    if (field.id === 'name' && !value) {
      setFieldError(field, 'Full name is required.');
      return false;
    }

    if (field.id === 'email') {
      if (!value) {
        setFieldError(field, 'Email is required.');
        return false;
      }
      if (!emailPattern.test(value)) {
        setFieldError(field, 'Please enter a valid email address.');
        return false;
      }
      setFieldError(field, '');
      return true;
    }

    if (field.id === 'subject' && !value) {
      setFieldError(field, 'Subject is required.');
      return false;
    }

    if (field.id === 'message' && !value) {
      setFieldError(field, 'Message is required.');
      return false;
    }

    setFieldError(field, '');
    return true;
  };

  Object.values(formFields).forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isValid = true;
    Object.values(formFields).forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formStatus = contactForm.querySelector('.form-status');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm)
      });

      if (!response.ok) {
        throw new Error('Contact form submission failed.');
      }

      contactForm.reset();
      submitButton.textContent = 'Message sent';
      if (formStatus) {
        formStatus.textContent = 'Your message was submitted successfully.';
        formStatus.classList.add('form-status--success');
      }
    } catch (error) {
      submitButton.textContent = originalText;
      if (formStatus) {
        formStatus.textContent = 'Submission failed. Please use WhatsApp or email instead.';
        formStatus.classList.add('form-status--error');
      }
    } finally {
      submitButton.disabled = false;
      if (submitButton.textContent === 'Message sent') {
        setTimeout(() => {
          submitButton.textContent = originalText;
        }, 2200);
      }
    }
  });
}
