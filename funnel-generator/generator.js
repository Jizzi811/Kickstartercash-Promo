/* =========================================================
   Kickstartercash.Club – Funnel-Generator (Logik)
   Der Partner trägt seinen Kickstartercash-Username + Kontakt-
   daten ein; alle Portal-Links (Reflink, Webinar, Impressum,
   Datenschutz) werden automatisch aus dem Username gebaut.
   Der erzeugte Funnel-Link nutzt kompakte Parameter und bleibt
   dadurch kurz. Vanilla JS, keine Abhängigkeiten.
   ========================================================= */
(function () {
  "use strict";

  var PORTAL = "https://portal.kickstartercash.club";
  var DEFAULT_CTA = "Jetzt kostenlos teilnehmen";

  var form = document.getElementById("gen-form");
  var errorEl = document.getElementById("gen-error");
  var resultEl = document.getElementById("gen-result");
  var linkInput = document.getElementById("gen-link");
  var copyBtn = document.getElementById("gen-copy");
  var openLink = document.getElementById("gen-open");
  var preview = document.getElementById("gen-preview");
  var copiedEl = document.getElementById("gen-copied");
  var userInput = document.getElementById("f-user");
  var lpBox = document.getElementById("gen-linkpreview");
  var lpRef = document.getElementById("lp-ref");
  var lpWeb = document.getElementById("lp-web");

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || "";
    errorEl.hidden = !msg;
  }

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function cleanUsername(v) {
    // @, Leerzeichen und Sonderzeichen raus – Portal-Usernamen sind alphanumerisch
    return (v || "").trim().replace(/^@/, "").replace(/\s+/g, "");
  }

  /* Live-Vorschau der Links, sobald der Username getippt wird */
  function updateLinkPreview() {
    var u = cleanUsername(userInput.value);
    if (!u) { lpBox.hidden = true; return; }
    lpRef.textContent = PORTAL + "/register.php?ref=" + u;
    lpWeb.textContent = PORTAL + "/public-webinars.php?ref=" + u;
    lpBox.hidden = false;
  }
  if (userInput) {
    userInput.addEventListener("input", updateLinkPreview);
    updateLinkPreview();
  }

  /* Kompakte URL bauen: nur Username + Kontaktdaten, alles andere ist fix */
  function buildUrl() {
    var qs = new URLSearchParams();
    var u = cleanUsername(form.elements.user.value);
    qs.set("u", u);
    var short = { name: "n", city: "c", email: "e", phone: "p", wa: "w", tg: "t", ig: "i" };
    Object.keys(short).forEach(function (field) {
      var el = form.elements[field];
      if (!el) return;
      var v = (el.value || "").trim();
      // WhatsApp weglassen, wenn identisch mit Telefon (spart Länge; Funnel nutzt dann Telefon)
      if (field === "wa" && v === (form.elements.phone.value || "").trim()) return;
      if (v) qs.set(short[field], v);
    });
    var cta = (form.elements.cta.value || "").trim();
    if (cta && cta !== DEFAULT_CTA) qs.set("cta", cta);

    var base = new URL("funnel.html", window.location.href);
    base.search = qs.toString();
    return base.toString();
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Kleiner Gold-Funken-Regen rund um den Button */
  function sparkle(fromEl) {
    if (reducedMotion) return;
    var r = fromEl.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    for (var k = 0; k < 14; k++) {
      var s = document.createElement("span");
      s.className = "gen-spark";
      var angle = (Math.PI * 2 * k) / 14 + Math.random() * 0.5;
      var dist = 60 + Math.random() * 70;
      s.style.left = cx + "px";
      s.style.top = cy + "px";
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist - 30 + "px");
      document.body.appendChild(s);
      setTimeout(function (el) { return function () { el.remove(); }; }(s), 900);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var u = cleanUsername(form.elements.user.value);
    var name = (form.elements.name.value || "").trim();
    var email = (form.elements.email.value || "").trim();

    if (!u) { showError("Bitte trage deinen Kickstartercash-Username ein."); userInput.focus(); return; }
    if (!name) { showError("Bitte gib deinen Namen ein."); return; }
    if (!isValidEmail(email)) { showError("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    showError("");

    var btn = form.querySelector(".gen-btn");
    var url = buildUrl();

    function reveal() {
      linkInput.value = url;
      openLink.setAttribute("href", url);
      preview.src = url;
      resultEl.hidden = false;
      if (copiedEl) copiedEl.textContent = "";
      if (btn) { btn.disabled = false; btn.textContent = "⚡ Funnel generieren"; sparkle(btn); }
      resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (btn && !reducedMotion) {
      btn.disabled = true;
      btn.textContent = "✨ Dein Funnel wird gebaut …";
      setTimeout(reveal, 550);
    } else {
      reveal();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = linkInput.value;
      function done() {
        if (copiedEl) {
          copiedEl.textContent = "✓ Link in die Zwischenablage kopiert.";
          copiedEl.classList.remove("pop");
          void copiedEl.offsetWidth; /* Animation neu starten */
          copiedEl.classList.add("pop");
        }
        var original = copyBtn.textContent;
        copyBtn.textContent = "✓ Kopiert!";
        setTimeout(function () { copyBtn.textContent = original; }, 1600);
      }
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
