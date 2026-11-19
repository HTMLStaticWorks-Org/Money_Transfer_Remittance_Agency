(() => {
  const root = document.documentElement;

  function getStore(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  function setStore(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors on restricted file:// origins.
    }
  }

  root.dataset.theme = getStore('grTheme', 'light');
  root.dir = getStore('grDir', 'ltr');
  document.body?.classList.toggle('rtl', root.dir === 'rtl');

  const themeButtons = document.querySelectorAll('button[data-theme]');
  const dirButtons = document.querySelectorAll('button[data-dir]');
  const sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  const moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function syncControls() {
    const isDark = root.dataset.theme === 'dark';
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    themeButtons.forEach(btn => {
      btn.innerHTML = isDark ? sunIcon : moonIcon;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('aria-pressed', String(isDark));
    });
    dirButtons.forEach(btn => {
      btn.textContent = root.dir.toUpperCase();
      btn.setAttribute('aria-pressed', String(root.dir === 'rtl'));
    });
  }

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.links a, .mobile a').forEach(link => {
    const hrefFile = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
    const isActive = hrefFile === currentFile;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setStore('grTheme', root.dataset.theme);
      syncControls();
    });
  });

  dirButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      root.dir = root.dir === 'rtl' ? 'ltr' : 'rtl';
      document.body?.classList.toggle('rtl', root.dir === 'rtl');
      setStore('grDir', root.dir);
      syncControls();
    });
  });

  syncControls();

  const burgerIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const closeIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  const mobileMenu = document.querySelector('.mobile');
  document.querySelectorAll('.mobile-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = mobileMenu?.classList.toggle('open') ?? false;
      btn.innerHTML = open ? closeIcon : burgerIcon;
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  const toast = document.querySelector('.toast');
  let toastTimer;

  function showToast(msg) {
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
    } else {
      alert(msg);
    }
  }

  document.querySelectorAll('form[data-demo]').forEach(form => {
    const pass = form.querySelector('input[name="password"]');
    const confirm = form.querySelector('input[name="confirmPassword"]');

    function checkMatch() {
      if (!pass || !confirm) return;
      const mismatch = confirm.value && pass.value !== confirm.value;
      confirm.setCustomValidity(mismatch ? 'Passwords do not match.' : '');
    }

    if (pass && confirm) {
      pass.addEventListener('input', checkMatch);
      confirm.addEventListener('input', checkMatch);
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      checkMatch();
      if (!form.reportValidity()) return;
      showToast(form.dataset.msg || 'Demo form only. Backend needed.');
    });
  });

  document.querySelectorAll('[data-forgot]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showToast('Demo only: password reset requires backend email delivery.');
    });
  });

  document.querySelectorAll('[data-social]').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.dataset.social || 'Social';
      showToast(`Demo only: ${provider} sign-in requires OAuth integration.`);
    });
  });

  document.querySelectorAll("[data-social-link]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.socialLink || "social";
      showToast(`Demo social link: connect your official ${name} profile.`);
    });
  });

  const eyeIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  const eyeOffIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a21.8 21.8 0 0 1 5.06-5.94"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a21.8 21.8 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/></svg>';

  document.querySelectorAll("[data-pass-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".pass-wrap")?.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? eyeOffIcon : eyeIcon;
      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  const corridors = {
    'USD-INR': { rate: 83.5, currency: 'INR' },
    'USD-PHP': { rate: 56.4, currency: 'PHP' },
    'GBP-INR': { rate: 105.0, currency: 'INR' },
    'EUR-MAD': { rate: 10.85, currency: 'MAD' },
    'AUD-VND': { rate: 16450, currency: 'VND' }
  };

  const methods = {
    bank: { fee: 5, eta: 'Within minutes (bank rail)' },
    wallet: { fee: 3.5, eta: 'Instant wallet credit' },
    cash: { fee: 8, eta: 'Ready for agent pickup' }
  };

  document.querySelectorAll('[data-calc]').forEach(form => {
    const receiveEl = form.querySelector('[data-receive]');
    const feeEl = form.querySelector('[data-fee]');
    const currencyEl = form.querySelector('[data-currency]');
    const etaEl = form.querySelector('[data-eta]');
    const sendEl = form.querySelector('[data-send]');

    function applyCorridor() {
      const preset = corridors[form.corridor?.value];
      if (!preset) return;
      if (form.rate) form.rate.value = preset.rate;
      if (currencyEl) currencyEl.textContent = preset.currency;
    }

    function applyMethod() {
      const preset = methods[form.method?.value];
      if (!preset) return;
      if (form.fee) form.fee.value = preset.fee;
      if (etaEl) etaEl.textContent = preset.eta;
    }

    function calc() {
      const amount = Number(form.amount?.value) || 0;
      const fee = Number(form.fee?.value) || 0;
      const rate = Number(form.rate?.value) || 0;
      if (receiveEl) {
        receiveEl.textContent = (Math.max(0, amount - fee) * rate).toLocaleString(undefined, {
          maximumFractionDigits: 2
        });
      }
      if (feeEl) feeEl.textContent = fee.toFixed(2);
      if (sendEl) sendEl.textContent = amount.toFixed(2);
    }

    form.corridor?.addEventListener('change', () => {
      applyCorridor();
      calc();
    });

    form.method?.addEventListener('change', () => {
      applyMethod();
      calc();
    });

    form.addEventListener('input', calc);
    applyCorridor();
    applyMethod();
    calc();
  });

  const filterButtons = document.querySelectorAll('[data-region-filter]');
  const regionRows = document.querySelectorAll('tr[data-region]');
  if (filterButtons.length && regionRows.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const region = btn.dataset.regionFilter || 'all';
        filterButtons.forEach(other => {
          const active = other === btn;
          other.classList.toggle('active', active);
          other.setAttribute('aria-pressed', String(active));
        });
        regionRows.forEach(row => {
          row.hidden = region !== 'all' && row.dataset.region !== region;
        });
      });
    });
  }

  const sampleTransfers = {
    'GR-1042': {
      stage: 2,
      status: 'Processing',
      route: 'USD → INR · Bank Deposit',
      detail: 'Payment confirmed. Standard compliance & partner payout check in progress.'
    },
    'GR-1041': {
      stage: 4,
      status: 'Delivered',
      route: 'GBP → PHP · Mobile Wallet',
      detail: 'Funds delivered to the recipient wallet. Reference receipt available.'
    },
    'GR-1039': {
      stage: 3,
      status: 'Sent',
      route: 'EUR → MAD · Cash Pickup',
      detail: 'Dispatched to payout partner network and awaiting recipient collection.'
    }
  };

  const trackForm = document.getElementById('track');
  const trackSummary = document.querySelector('[data-track-summary]');
  const stageSteps = document.querySelectorAll('[data-step-stage]');
  const sampleChips = document.querySelectorAll('[data-sample-ref]');

  function renderTrackState(refCode) {
    const code = (refCode || '').trim().toUpperCase();
    const record = sampleTransfers[code] || {
      stage: 2,
      status: 'Demo Lookup Validated',
      route: 'Illustrative status preview',
      detail: `Reference "${code || 'N/A'}" validated in demo mode. Connect live provider API for real lookup.`
    };

    stageSteps.forEach(step => {
      const stageNum = Number(step.dataset.stepStage) || 0;
      step.classList.toggle('current', stageNum === record.stage);
    });

    if (trackSummary) {
      const badgeEl = trackSummary.querySelector('[data-track-status]');
      const refEl = trackSummary.querySelector('[data-track-ref]');
      const routeEl = trackSummary.querySelector('[data-track-route]');
      const detailEl = trackSummary.querySelector('[data-track-detail]');
      if (badgeEl) badgeEl.textContent = record.status;
      if (refEl) refEl.textContent = code || 'GR-1042';
      if (routeEl) routeEl.textContent = record.route;
      if (detailEl) detailEl.textContent = record.detail;
    }

    sampleChips.forEach(chip => {
      chip.classList.toggle('active', (chip.dataset.sampleRef || '').toUpperCase() === code);
    });
  }

  if (trackForm && stageSteps.length) {
    sampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const ref = chip.dataset.sampleRef || 'GR-1042';
        if (trackForm.ref) trackForm.ref.value = ref;
        if (trackForm.contact && !trackForm.contact.value) {
          trackForm.contact.value = 'demo@globalremit.example';
        }
        renderTrackState(ref);
      });
    });

    trackForm.addEventListener('submit', () => {
      if (trackForm.reportValidity()) {
        renderTrackState(trackForm.ref?.value);
      }
    });

    renderTrackState('GR-1042');
  }

  const hubButtons = document.querySelectorAll('[data-map-bbox]');
  const hubMap = document.querySelector('[data-hub-map]');
  const hubLabel = document.querySelector('[data-hub-label]');

  if (hubButtons.length && hubMap) {
    hubButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const bbox = btn.dataset.mapBbox;
        if (!bbox) return;
        hubMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`;
        if (hubLabel && btn.dataset.mapName) {
          hubLabel.textContent = `Showing preview for ${btn.dataset.mapName} (not a verified branch location).`;
        }
        hubButtons.forEach(other => {
          const active = other === btn;
          other.classList.toggle('active', active);
          other.setAttribute('aria-pressed', String(active));
        });
      });
    });
  }

  const checkList = document.querySelector('[data-check-list]');
  const checkCountEl = document.querySelector('[data-check-count]');

  if (checkList) {
    const boxes = checkList.querySelectorAll('input[type="checkbox"]');
    function syncChecklist() {
      let checked = 0;
      boxes.forEach(box => {
        const item = box.closest('.check-item');
        if (box.checked) checked += 1;
        item?.classList.toggle('checked', box.checked);
      });
      if (checkCountEl) {
        checkCountEl.textContent = `${checked} / ${boxes.length} completed`;
      }
    }
    boxes.forEach(box => box.addEventListener('change', syncChecklist));
    syncChecklist();
  }

  const dashTabs = document.querySelectorAll("[data-dash-tab]");
  const dashPanels = document.querySelectorAll("[data-dash-panel]");
  const dashJumps = document.querySelectorAll("[data-dash-jump]");
  const sideToggle = document.querySelector("[data-side-toggle]");
  const sideDrawer = document.querySelector("[data-side-drawer]");

  if (sideToggle && sideDrawer) {
    sideToggle.addEventListener("click", () => {
      const open = sideDrawer.classList.toggle("open");
      sideToggle.innerHTML = open ? closeIcon : burgerIcon;
      sideToggle.setAttribute("aria-expanded", String(open));
    });
  }

  function activateDashTab(target) {
    if (!target) return;
    dashPanels.forEach((panel) => {
      panel.hidden = panel.dataset.dashPanel !== target;
    });
    dashTabs.forEach((tab) => {
      const active = tab.dataset.dashTab === target;
      tab.classList.toggle("active", active);
      if (active) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });
    sideDrawer?.classList.remove("open");
    if (sideToggle) {
      sideToggle.innerHTML = burgerIcon;
      sideToggle.setAttribute("aria-expanded", "false");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (dashTabs.length && dashPanels.length) {
    dashTabs.forEach((tab) => {
      tab.addEventListener("click", () => activateDashTab(tab.dataset.dashTab));
    });
    dashJumps.forEach((btn) => {
      btn.addEventListener("click", () =>
        activateDashTab(btn.dataset.dashJump),
      );
    });
  }

  const dashFilters = document.querySelectorAll("[data-dash-filter]");
  const dashRows = document.querySelectorAll("tr[data-status]");

  if (dashFilters.length && dashRows.length) {
    dashFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const status = btn.dataset.dashFilter || "all";
        dashFilters.forEach((other) => {
          const active = other === btn;
          other.classList.toggle("active", active);
          other.setAttribute("aria-pressed", String(active));
        });
        dashRows.forEach((row) => {
          row.hidden = status !== "all" && row.dataset.status !== status;
        });
      });
    });
  }

  document.querySelectorAll("[data-receipt-demo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.receiptDemo || "RCP";
      showToast(
        `Demo receipt ${id} preview only — connect backend for PDF export.`,
      );
    });
  });

  let backTopFloat = document.querySelector(".back-to-top");
  if (!backTopFloat && document.body) {
    backTopFloat = document.createElement("button");
    backTopFloat.className = "back-to-top";
    backTopFloat.type = "button";
    backTopFloat.setAttribute("data-back-to-top", "");
    backTopFloat.setAttribute("aria-label", "Back to top");
    backTopFloat.setAttribute("title", "Back to top");
    backTopFloat.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
    if (toast && toast.parentNode) {
      toast.parentNode.insertBefore(backTopFloat, toast);
    } else {
      document.body.appendChild(backTopFloat);
    }
  }

  document.querySelectorAll("[data-back-to-top]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  function syncBackToTop() {
    if (!backTopFloat) return;
    backTopFloat.classList.toggle("show", window.scrollY > 220);
  }

  window.addEventListener("scroll", syncBackToTop, { passive: true });
  syncBackToTop();
})();
