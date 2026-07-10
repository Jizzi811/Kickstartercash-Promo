/* =========================================================
   Kickstartercash.Club – Funnel-Generator (Logik)
   Baut aus den Formulardaten einen personalisierten
   funnel.html-Link (URL-Parameter), zeigt Live-Vorschau
   und bietet Kopier-/Öffnen-Buttons.
   Vanilla JS, keine Abhängigkeiten.
   ========================================================= */
(function () {
  "use strict";

  var form = document.getElementById("gen-form");
  var errorEl = document.getElementById("gen-error");
  var resultEl = document.getElementById("gen-result");
  var linkInput = document.getElementById("gen-link");
  var copyBtn = document.getElementById("gen-copy");
  var openLink = document.getElementById("gen-open");
  var preview = document.getElementById("gen-preview");
  var copiedEl = document.getElementById("gen-copied");

  // Formularfeld -> URL-Parameter (nur nicht-leere werden übernommen)
  var TEXT_FIELDS = [
    "name", "role", "city", "email", "phone", "wa",
    "tg", "ig", "ref", "cta", "webinar", "impressum",
    "datenschutz", "video"
  ];

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || "";
    errorEl.hidden = !msg;
  }

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function buildUrl() {
    var qs = new URLSearchParams();
    TEXT_FIELDS.forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var v = (el.value || "").trim();
      if (v) qs.set(name, v);
    });
    if (form.elements.countdown && form.elements.countdown.checked) {
      qs.set("countdown", "1");
    }
    var base = new URL("funnel.html", window.location.href);
    base.search = qs.toString();
    return base.toString();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = (form.elements.name.value || "").trim();
    var email = (form.elements.email.value || "").trim();
    var ref = (form.elements.ref.value || "").trim();

    if (!name) { showError("Bitte gib deinen Namen ein."); return; }
    if (!isValidEmail(email)) { showError("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (!ref) { showError("Bitte gib deinen Reflink ein (Ziel-URL der CTA-Buttons)."); return; }
    showError("");

    var url = buildUrl();
    linkInput.value = url;
    openLink.setAttribute("href", url);
    preview.src = url;
    resultEl.hidden = false;
    if (copiedEl) copiedEl.textContent = "";

    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = linkInput.value;
      function done() { if (copiedEl) copiedEl.textContent = "✓ Link in die Zwischenablage kopiert."; }
      function fallback() {
        linkInput.removeAttribute("readonly");
        linkInput.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        linkInput.setAttribute("readonly", "");
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  }
})();
