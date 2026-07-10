/* =========================================================
   Kickstarter Cash Club – Opt-in Komponente (Logik)
   Vanilla JS, keine Abhängigkeiten.

   Konfiguration über data-Attribute am Element .kcc-optin:
     data-funnel-url  = Ziel-URL, zu der nach dem Absenden weitergeleitet wird
     data-webhook-url = (optional) Endpoint, an den die Kontaktdaten
                        per POST (JSON) geschickt werden (z. B. dein
                        Mailtool / Zapier / Make / eigenes Backend)
   ========================================================= */
(function () {
  "use strict";

  function initOptin(root) {
    var form = root.querySelector(".kcc-optin__form");
    if (!form) return;

    var funnelUrl = root.getAttribute("data-funnel-url") || "";
    var webhookUrl = root.getAttribute("data-webhook-url") || "";
    var errorEl = root.querySelector(".kcc-optin__error");
    var submitBtn = root.querySelector(".kcc-optin__submit");

    // Erfolgs-Block einmalig anlegen
    var successEl = document.createElement("div");
    successEl.className = "kcc-optin__success";
    successEl.innerHTML =
      '<div class="kcc-optin__success-icon">✓</div>' +
      "<h3>Geschafft &ndash; willkommen!</h3>" +
      "<p>Du wirst gleich zum Kickstartercash.Club weitergeleitet &hellip;</p>";
    root.querySelector(".kcc-optin__inner").appendChild(successEl);

    function showError(msg) {
      if (errorEl) errorEl.textContent = msg || "";
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function goToFunnel() {
      root.classList.add("is-success");
      if (funnelUrl) {
        window.setTimeout(function () {
          window.location.href = funnelUrl;
        }, 1200);
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showError("");

      var nameInput = form.querySelector('[name="name"]');
      var emailInput = form.querySelector('[name="email"]');
      var consentInput = form.querySelector('[name="consent"]');

      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";

      // Validierung
      [nameInput, emailInput].forEach(function (el) {
        if (el) el.classList.remove("kcc-invalid");
      });

      if (!name) {
        nameInput.classList.add("kcc-invalid");
        showError("Bitte gib deinen Vornamen ein.");
        return;
      }
      if (!isValidEmail(email)) {
        emailInput.classList.add("kcc-invalid");
        showError("Bitte gib eine gültige E-Mail-Adresse ein.");
        return;
      }
      if (consentInput && !consentInput.checked) {
        showError("Bitte bestätige die Einwilligung.");
        return;
      }

      var payload = {
        name: name,
        email: email,
        source: "kickstarter-cash-club-optin",
        page: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Kein Webhook konfiguriert -> direkt weiterleiten
      if (!webhookUrl) {
        goToFunnel();
        return;
      }

      root.classList.add("is-loading");
      submitBtn.disabled = true;

      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function () {
          goToFunnel();
        })
        .catch(function () {
          // Auch bei Fehler weiterleiten, damit der User nicht hängen bleibt.
          // (Datenerfassung ggf. serverseitig absichern.)
          goToFunnel();
        })
        .finally(function () {
          root.classList.remove("is-loading");
          submitBtn.disabled = false;
        });
    });
  }

  function boot() {
    var nodes = document.querySelectorAll(".kcc-optin");
    Array.prototype.forEach.call(nodes, initOptin);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
