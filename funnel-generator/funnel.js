/* =========================================================
   Kickstartercash.Club – Funnel-Logik
   Personalisiert das Template über kompakte URL-Parameter.
   Alle Portal-Links (Reflink, Webinar, Impressum, Datenschutz)
   werden fest aus dem Username gebaut – nur die Kontaktdaten
   des Partners sind variabel. Vanilla JS, keine Abhängigkeiten.

   Parameter (kurz / legacy):
     u  (user)   – Kickstartercash-Username (baut alle Portal-Links)
     n  (name)   – Name des Partners
     c  (city)   – Stadt
     e  (email)  – E-Mail
     p  (phone)  – Telefon
     w  (wa)     – WhatsApp (leer = Telefon)
     t  (tg)     – Telegram-Handle
     i  (ig)     – Instagram-Handle
     cta         – CTA-Button-Text
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var PORTAL = "https://portal.kickstartercash.club";
  var params = new URLSearchParams(window.location.search);

  function p(keys, fallback) {
    for (var k = 0; k < keys.length; k++) {
      var v = params.get(keys[k]);
      if (v !== null && v !== "") return v;
    }
    return fallback;
  }
  function digits(x) { return String(x || "").replace(/[^0-9]/g, ""); }

  var username = (p(["u", "user", "username"], "")).trim().replace(/^@/, "").replace(/\s+/g, "");

  /* Portal-Links: fest verdrahtet, nur der Username wird eingesetzt */
  function portalLink(path) {
    return PORTAL + path + (username ? "?ref=" + encodeURIComponent(username) : "");
  }
  function legalLink(doc) {
    return PORTAL + "/legal.php?doc=" + doc + (username ? "&ref=" + encodeURIComponent(username) : "");
  }

  var cfg = {
    sName: p(["n", "name"], "Dein Name"),
    sCity: p(["c", "city"], "Online"),
    sEmail: p(["e", "email"], ""),
    sPhone: p(["p", "phone"], ""),
    sWa: p(["w", "wa"], "") || p(["p", "phone"], ""),
    sTelegram: p(["t", "tg"], ""),
    sInstagram: p(["i", "ig"], ""),
    ctaText: p(["cta"], "Jetzt kostenlos teilnehmen"),
    ref: username ? portalLink("/register.php") : p(["ref"], PORTAL),
    webinarUrl: portalLink("/public-webinars.php"),
    impressumUrl: legalLink("impressum"),
    datenschutzUrl: legalLink("datenschutz")
  };

  var tg = cfg.sTelegram.trim();
  var ig = cfg.sInstagram.trim();
  var vals = {
    ref: cfg.ref,
    webinarUrl: cfg.webinarUrl,
    ctaText: cfg.ctaText,
    sName: cfg.sName,
    sRole: "Offizieller Partner", /* fest, nicht änderbar */
    sCity: cfg.sCity,
    sPhone: cfg.sPhone,
    sEmail: cfg.sEmail,
    sTelegram: tg,
    sInstagram: ig,
    sPhoneHref: "tel:" + digits(cfg.sPhone),
    sEmailHref: "mailto:" + cfg.sEmail,
    sWaHref: "https://wa.me/" + digits(cfg.sWa),
    sTelegramHref: "https://t.me/" + tg.replace(/^@/, ""),
    sInstagramHref: "https://instagram.com/" + ig.replace(/^@/, ""),
    impressumUrl: cfg.impressumUrl,
    datenschutzUrl: cfg.datenschutzUrl,
    hasTelegram: !!tg,
    hasInstagram: !!ig,
    hasPhone: !!digits(cfg.sPhone),
    hasWa: !!digits(cfg.sWa),
    hasEmail: !!cfg.sEmail
  };

  function applyBindings() {
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      if (key in vals && vals[key] !== undefined) el.textContent = vals[key];
    });
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var key = el.getAttribute("data-href");
      if (key in vals && vals[key]) el.setAttribute("href", vals[key]);
    });
    document.querySelectorAll("[data-if]").forEach(function (el) {
      var key = el.getAttribute("data-if");
      el.hidden = !vals[key];
    });
  }

  /* ---- Scroll-Reveals: Elemente erscheinen sanft beim Reinscrollen ---- */
  function initReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("kc-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("kc-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---- Gold-Fortschrittsbalken oben (scrollgebunden, kein Autoplay) ---- */
  function initProgress() {
    var bar = document.createElement("div");
    bar.id = "kc-progress";
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function boot() {
    applyBindings();
    initReveal();
    initProgress();
    document.title = "Kickstartercash.Club – " + vals.sName;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
