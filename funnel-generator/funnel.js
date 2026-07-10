/* =========================================================
   Kickstartercash.Club – Funnel-Logik
   Personalisiert das Template über URL-Parameter, steuert
   Countdown und Lead-Formular (WhatsApp an den Berater).
   Vanilla JS, keine Abhängigkeiten.

   Erwartete URL-Parameter (alle optional):
     ref, cta, name, role, city, phone, wa, email, tg, ig,
     webinar (ISO-Datum), countdown (1/0), impressum,
     datenschutz, video (URL fürs Promo-iframe)
   ========================================================= */
(function () {
  "use strict";

  var DEFAULT_URL = "https://portal.kickstartercash.club";
  var params = new URLSearchParams(window.location.search);
  function p(key, fallback) {
    var v = params.get(key);
    return v !== null && v !== "" ? v : fallback;
  }
  function digits(x) { return String(x || "").replace(/[^0-9]/g, ""); }

  var cfg = {
    ref: p("ref", DEFAULT_URL),
    ctaText: p("cta", "Jetzt kostenlos teilnehmen"),
    sName: p("name", "Nadja Masurkewitsch"),
    sRole: p("role", "Vertriebspartner"),
    sCity: p("city", "Duisburg"),
    sPhone: p("phone", "+49 175 9913517"),
    sWa: p("wa", "+491759913517"),
    sEmail: p("email", "nmasurk@gmail.com"),
    sTelegram: p("tg", ""),
    sInstagram: p("ig", ""),
    webinarDate: p("webinar", ""),
    countdownEnabled: p("countdown", "0") === "1",
    impressumUrl: p("impressum", DEFAULT_URL),
    datenschutzUrl: p("datenschutz", DEFAULT_URL),
    // Standard-Promo-Video; per ?video=… überschreibbar, ?video=off blendet es aus
    video: p("video", "promo/promo.html")
  };

  // Abgeleitete Werte
  var tg = cfg.sTelegram.trim();
  var ig = cfg.sInstagram.trim();
  var vals = {
    ref: cfg.ref,
    ctaText: cfg.ctaText,
    sName: cfg.sName,
    sRole: cfg.sRole,
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
    countdownEnabled: cfg.countdownEnabled,
    cdD: "00", cdH: "00", cdM: "00", cdS: "00",
    cdLive: false, cdPending: cfg.countdownEnabled
  };

  function applyBindings() {
    // Text
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      if (key in vals && vals[key] !== undefined) el.textContent = vals[key];
    });
    // Links
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var key = el.getAttribute("data-href");
      if (key in vals && vals[key]) el.setAttribute("href", vals[key]);
    });
    // Bedingte Blöcke
    document.querySelectorAll("[data-if]").forEach(function (el) {
      var key = el.getAttribute("data-if");
      el.hidden = !vals[key];
    });
  }

  /* ---- Promo-Video: Standard promo/promo.html, per ?video= überschreibbar ---- */
  function initVideo() {
    if (!cfg.video || cfg.video === "off") return; // Platzhalter behalten
    var box = document.getElementById("kc-video");
    if (!box) return;
    box.innerHTML = "";
    var frame = document.createElement("iframe");
    frame.src = cfg.video;
    frame.title = "Kickstartercash.Club Promo-Video";
    frame.loading = "lazy";
    frame.setAttribute("allow", "autoplay; fullscreen");
    frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;";
    box.appendChild(frame);
  }

  /* ---- Countdown ---- */
  var timer = null;
  function pad(n) { return String(n).padStart(2, "0"); }
  function targetTime() {
    var raw = (cfg.webinarDate || "").trim();
    var t = raw ? Date.parse(raw) : NaN;
    if (isNaN(t)) t = Date.now() + 5 * 24 * 3600 * 1000;
    return t;
  }
  function setCountdownText() {
    document.querySelectorAll('[data-bind="cdD"]').forEach(function (e) { e.textContent = vals.cdD; });
    document.querySelectorAll('[data-bind="cdH"]').forEach(function (e) { e.textContent = vals.cdH; });
    document.querySelectorAll('[data-bind="cdM"]').forEach(function (e) { e.textContent = vals.cdM; });
    document.querySelectorAll('[data-bind="cdS"]').forEach(function (e) { e.textContent = vals.cdS; });
    document.querySelectorAll('[data-if="cdLive"]').forEach(function (e) { e.hidden = !vals.cdLive; });
    document.querySelectorAll('[data-if="cdPending"]').forEach(function (e) { e.hidden = !vals.cdPending; });
  }
  function tick() {
    var diff = targetTime() - Date.now();
    if (diff <= 0) {
      vals.cdLive = true; vals.cdPending = false;
      vals.cdD = vals.cdH = vals.cdM = vals.cdS = "00";
    } else {
      vals.cdLive = false; vals.cdPending = true;
      vals.cdD = pad(Math.floor(diff / 86400000));
      vals.cdH = pad(Math.floor((diff % 86400000) / 3600000));
      vals.cdM = pad(Math.floor((diff % 3600000) / 60000));
      vals.cdS = pad(Math.floor((diff % 60000) / 1000));
    }
    setCountdownText();
  }
  function initCountdown() {
    if (!cfg.countdownEnabled) return;
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---- Lead-Formular ---- */
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function buildLeadWaHref(f) {
    var lines = [
      "Neue Anfrage über den Kickstartercash.Club Funnel:",
      "Name: " + f.vorname + " " + f.nachname,
      "E-Mail: " + f.email,
      f.telefon ? "Telefon: " + f.telefon : "",
      f.land ? "Land: " + f.land : "",
      f.nachricht ? "Nachricht: " + f.nachricht : ""
    ].filter(Boolean);
    return "https://wa.me/" + digits(cfg.sWa) + "?text=" + encodeURIComponent(lines.join("\n"));
  }
  function initForm() {
    var form = document.getElementById("kc-lead-form");
    if (!form) return;
    var errorEl = document.getElementById("kc-lead-error");
    var successEl = document.getElementById("kc-lead-success");
    var waLink = document.getElementById("kc-lead-wa");
    var resetBtn = document.getElementById("kc-lead-reset");

    function showError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg || "";
      errorEl.hidden = !msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = {
        vorname: (form.vorname.value || "").trim(),
        nachname: (form.nachname.value || "").trim(),
        email: (form.email.value || "").trim(),
        telefon: (form.telefon.value || "").trim(),
        land: (form.land.value || "").trim(),
        nachricht: (form.nachricht.value || "").trim(),
        consent: form.consent.checked
      };
      if (!f.vorname || !isValidEmail(f.email) || !f.consent) {
        showError("Bitte fülle Vorname, eine gültige E-Mail und das Einverständnis aus.");
        return;
      }
      showError("");
      if (waLink) waLink.setAttribute("href", buildLeadWaHref(f));
      form.hidden = true;
      if (successEl) successEl.hidden = false;
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        if (successEl) successEl.hidden = true;
        form.hidden = false;
        showError("");
      });
    }
  }

  function boot() {
    applyBindings();
    initVideo();
    initCountdown();
    initForm();
    document.title = "Kickstartercash.Club – " + cfg.sName;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
