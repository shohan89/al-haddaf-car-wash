/* ==========================================================================
   AL HADDAF CAR WASH — SCRIPT.JS
   Vanilla JS only. No dependencies.
   Sections: Header scroll, FAB visibility, Carousel, FAQ accordion,
   Scroll-reveal, Lead form -> Web3Forms submit, Misc.
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setFooterYear();
    initHeaderScroll();
    initFabVisibility();
    initCarousels();
    initFaqAccordion();
    initScrollReveal();
    initLeadForm({
      formId: 'quoteForm',
      nameId: 'qName',
      phoneId: 'qPhone',
      emailId: 'qEmail',
      serviceId: 'qService',
      nameErrorId: 'qNameError',
      phoneErrorId: 'qPhoneError',
      emailErrorId: 'qEmailError'
    });
  }

  /* ------------------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------------ */
  function setFooterYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     Sticky header — add elevated state after scrolling past hero
  ------------------------------------------------------------------------ */
  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    var toggle = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Floating call/WhatsApp buttons — shown only outside the hero, where the
     page has no call/WhatsApp/quote-form action of its own.
  ------------------------------------------------------------------------ */
  function initFabVisibility() {
    var fabs = document.querySelector('.fab-group');
    if (!fabs) return;

    var zones = [document.getElementById('hero')].filter(Boolean);

    if (!zones.length || !('IntersectionObserver' in window)) {
      fabs.classList.add('is-visible');
      return;
    }

    var onScreen = new Set();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      });
      fabs.classList.toggle('is-visible', onScreen.size === 0);
    }, { threshold: 0 });

    zones.forEach(function (zone) { observer.observe(zone); });
  }

  /* ------------------------------------------------------------------------
     Carousel (customer reviews)
     The track is a CSS scroll-snap container, so touch swipe is native and
     free. This only drives scrollLeft from the buttons/dots and mirrors the
     scroll position back into the dots. Page count adapts to how many cards
     fit per view, so the same code covers 3-up, 2-up and 1-up layouts.
  ------------------------------------------------------------------------ */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
      var viewport = root.querySelector('.carousel__viewport');
      var slides = root.querySelectorAll('.carousel__slide');
      var prevBtn = root.querySelector('[data-carousel-prev]');
      var nextBtn = root.querySelector('[data-carousel-next]');
      var dotsWrap = root.querySelector('[data-carousel-dots]');
      var counter = root.querySelector('[data-carousel-count]');
      if (!viewport || !slides.length) return;

      var pages = 1;
      var current = 0;

      function perView() {
        var slideWidth = slides[0].getBoundingClientRect().width;
        if (!slideWidth) return 1;
        return Math.max(1, Math.round(viewport.clientWidth / slideWidth));
      }

      function pageCount() {
        return Math.max(1, Math.ceil(slides.length / perView()));
      }

      function goTo(page) {
        current = Math.max(0, Math.min(pages - 1, page));
        viewport.scrollTo({ left: current * viewport.clientWidth, behavior: 'smooth' });
        syncControls();
      }

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        for (var i = 0; i < pages; i++) {
          (function (index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel__dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Go to review slide ' + (index + 1) + ' of ' + pages);
            dot.addEventListener('click', function () { goTo(index); });
            dotsWrap.appendChild(dot);
          })(i);
        }
      }

      function syncControls() {
        if (dotsWrap) {
          dotsWrap.querySelectorAll('.carousel__dot').forEach(function (dot, i) {
            dot.setAttribute('aria-selected', String(i === current));
          });
        }
        if (counter) counter.textContent = (current + 1) + ' / ' + pages;
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current >= pages - 1;
      }

      function readScroll() {
        var width = viewport.clientWidth;
        if (!width) return;
        var page = Math.round(viewport.scrollLeft / width);
        if (page !== current) {
          current = Math.max(0, Math.min(pages - 1, page));
          syncControls();
        }
      }

      function rebuild() {
        var next = pageCount();
        if (next !== pages) {
          pages = next;
          current = Math.min(current, pages - 1);
          buildDots();
        }
        syncControls();
      }

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

      viewport.addEventListener('scroll', debounce(readScroll, 90), { passive: true });

      viewport.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { goTo(current - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
      });

      window.addEventListener('resize', debounce(rebuild, 150), { passive: true });

      pages = pageCount();
      buildDots();
      syncControls();
    });
  }

  function debounce(fn, wait) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }

  /* ------------------------------------------------------------------------
     FAQ accordion
  ------------------------------------------------------------------------ */
  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-item__question');

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        questions.forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
        });

        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll-reveal — IntersectionObserver fades/slides elements into view
  ------------------------------------------------------------------------ */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Lead form (the hero quote form) — client-side validation, then submit
     to Web3Forms (https://web3forms.com) via fetch so the page never
     navigates away. Set the real access_key on the form's hidden input
     before launch — see index.html.
  ------------------------------------------------------------------------ */
  function initLeadForm(config) {
    var form = document.getElementById(config.formId);
    if (!form) return;

    var nameField = document.getElementById(config.nameId);
    var phoneField = document.getElementById(config.phoneId);
    var emailField = document.getElementById(config.emailId);
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var isValid = true;

      if (nameField && !nameField.value.trim()) {
        showError(config.nameId, config.nameErrorId, 'Please enter your name.');
        isValid = false;
      }

      var phoneDigits = phoneField ? phoneField.value.replace(/[^0-9+]/g, '') : '';
      if (phoneDigits.length < 8) {
        showError(config.phoneId, config.phoneErrorId, 'Please enter a valid phone number.');
        isValid = false;
      }

      var emailValue = emailField ? emailField.value.trim() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        showError(config.emailId, config.emailErrorId, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!isValid) return;

      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            window.location.href = '/interior-detailing/thank-you.html';
            return;
          }
          showToast('Something went wrong. Please call or WhatsApp us instead.');
        })
        .catch(function () {
          showToast('Something went wrong. Please call or WhatsApp us instead.');
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });

    function showError(fieldId, errorId, msg) {
      var field = document.getElementById(fieldId);
      var errorEl = errorId ? document.getElementById(errorId) : null;
      if (field) field.closest('.form-group').classList.add('has-error');
      if (errorEl) errorEl.textContent = msg;
    }

    function clearErrors() {
      form.querySelectorAll('.form-group.has-error').forEach(function (group) {
        group.classList.remove('has-error');
      });
      form.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
    }
  }

  /* ------------------------------------------------------------------------
     Toast notification
  ------------------------------------------------------------------------ */
  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 4000);
  }

})();
