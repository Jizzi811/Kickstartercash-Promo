# Kickstartercash.Club – Funnel-Generator

Eine Homepage-Komponente, mit der **Partner ihre eigenen Kontaktdaten**
eintragen und per Klick auf **„Funnel generieren"** ihren **persönlichen,
mit ihren Daten gefüllten Funnel** erhalten – als Live-Vorschau und als
teilbaren, kurzen Link.

## Dateien

| Datei            | Zweck                                                        |
| ---------------- | ------------------------------------------------------------ |
| `index.html`     | Der Generator (Formular + Vorschau + teilbarer Link)         |
| `generator.css`  | Styling des Generators (Funnel-Look)                         |
| `generator.js`   | Logik: Formular → kurzer Link → Vorschau                     |
| `funnel.html`    | Das Funnel-Template (personalisiert über URL-Parameter)      |
| `funnel.css`     | Styling des Funnels (1:1 aus dem Original)                   |
| `funnel.js`      | Personalisierung + Scroll-Reveals                            |
| `assets/`        | Bilder (Logo, Hero, Weltkarte, Hintergrund, Berater, Webinar)|
| `promo/promo.html` | Promo-Video (fest eingebettet, nicht änderbar)             |

## Das Username-Prinzip

Der Partner trägt nur seinen **Kickstartercash-Username** ein – daraus werden
alle Portal-Links **automatisch und fest** gebaut:

| Link          | Aufbau                                                              |
| ------------- | ------------------------------------------------------------------- |
| Reflink       | `https://portal.kickstartercash.club/register.php?ref=USERNAME`     |
| Webinar       | `https://portal.kickstartercash.club/public-webinars.php?ref=USERNAME` |
| Impressum     | `https://portal.kickstartercash.club/legal.php?doc=impressum&ref=USERNAME` |
| Datenschutz   | `https://portal.kickstartercash.club/legal.php?doc=datenschutz&ref=USERNAME` |

**Fest verdrahtet (nicht änderbar):** Rolle („Offizieller Partner"),
Promo-Video, Webinar-Bild, Impressum-/Datenschutz-Aufbau.

## Kurzer Funnel-Link

Da fast alles fix ist, bleibt der generierte Link kurz – er enthält nur den
Username und die Kontaktdaten (kompakte Parameter):

```
funnel.html?u=johann&n=Johann+Schorn&c=Istanbul&e=mail@x.com&p=%2B905...
```

| Parameter | Bedeutung                       |
| --------- | ------------------------------- |
| `u`       | Kickstartercash-Username        |
| `n`       | Name                            |
| `c`       | Stadt                           |
| `e`       | E-Mail                          |
| `p`       | Telefon                         |
| `w`       | WhatsApp (weggelassen = Telefon)|
| `t`       | Telegram-Handle                 |
| `i`       | Instagram-Handle                |
| `cta`     | CTA-Text (nur wenn geändert)    |

Die alten, langen Parameternamen (`name`, `city`, `email`, …) funktionieren
weiterhin (Rückwärtskompatibilität für bereits geteilte Links).

## Webinar-Sektion („Sichere dir deinen Platz")

Statt eines Formulars zeigt der Funnel ein festes **Webinar-Bild**
(`assets/webinar.jpg`), das direkt auf den persönlichen Webinar-Link des
Partners verlinkt – plus einen goldenen CTA-Button darunter.
Fehlt die Bilddatei, erscheint automatisch ein gestalteter Fallback-Block.

## Vorschau lokal

```bash
cd funnel-generator
python3 -m http.server 8080
# dann http://localhost:8080/ öffnen
```

## Promo-Video

`promo/promo.html` ist fest im Webinar-Bereich eingebettet (lazy iframe).

> **Hinweis:** Die Datei lädt zur Laufzeit React und Schriften aus dem Netz
> (CDN) – auf einem echten Server mit Internet läuft sie problemlos.

## Anpassen (Entwickler)

- **Design:** zentrale Tokens in `funnel.css` / `generator.css`.
- **Portal-Basis-URL & Link-Aufbau:** oben in `funnel.js` (`PORTAL`,
  `portalLink()`, `legalLink()`) und `generator.js` (`PORTAL`).
- **Weitere Felder:** Feld in `index.html` ergänzen, Kürzel in
  `generator.js` (`short`-Map) aufnehmen und in `funnel.js` (`cfg`/`vals`)
  einbinden.
