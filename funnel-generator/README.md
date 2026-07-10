# Kickstartercash.Club – Funnel-Generator

Eine Homepage-Komponente, mit der **Partner ihre eigenen Kontaktdaten**
eintragen und per Klick auf **„Funnel generieren"** ihren **persönlichen,
mit ihren Daten gefüllten Funnel** erhalten – als Live-Vorschau und als
teilbaren Link.

## Dateien

| Datei            | Zweck                                                        |
| ---------------- | ------------------------------------------------------------ |
| `index.html`     | Der Generator (Formular + Vorschau + teilbarer Link)         |
| `generator.css`  | Styling des Generators (Funnel-Look)                         |
| `generator.js`   | Logik: Formular → URL-Parameter → Vorschau & Link            |
| `funnel.html`    | Das Funnel-Template (wird über URL-Parameter personalisiert) |
| `funnel.css`     | Styling des Funnels (1:1 aus dem Original)                   |
| `funnel.js`      | Personalisierung, Countdown, Lead-Formular (WhatsApp)        |
| `assets/`        | Bilder (Logo, Hero-Logo, Weltkarte, Hintergrund, Berater)    |

## So funktioniert's

1. Der Partner öffnet `index.html`.
2. Er trägt seine Daten ein (Name, Kontakt, **Reflink**, optional Telegram/
   Instagram, Webinar-Termin …).
3. Klick auf **„Funnel generieren"**.
4. Es erscheint sofort:
   - eine **Live-Vorschau** des fertigen Funnels,
   - ein **teilbarer Link** (die Daten stecken in den URL-Parametern),
   - Buttons zum **Kopieren** und **Öffnen in neuem Tab**.
5. Diesen Link gibt der Partner an seine Interessenten weiter – jeder sieht
   den Funnel mit **seinen** Kontaktdaten und **seinem** Reflink.

Es ist **kein Backend nötig** – alles läuft rein im Browser (statisch
hostbar, z. B. GitHub Pages, Netlify, eigener Webspace).

## Vorschau lokal

```bash
cd funnel-generator
python3 -m http.server 8080
# dann http://localhost:8080/ öffnen
```

> Direkt per Doppelklick (`file://`) funktioniert es auch, nur laden manche
> Browser dann keine externen Google-Fonts – auf einem echten Server ist das
> kein Thema.

## URL-Parameter des Funnels

`funnel.html` liest folgende Parameter (alle optional, sinnvolle Defaults):

| Parameter     | Bedeutung                                        |
| ------------- | ------------------------------------------------ |
| `name`        | Name des Beraters/Partners                       |
| `role`        | Rolle / Titel                                    |
| `city`        | Stadt                                            |
| `email`       | E-Mail (Kontakt + `mailto:`)                     |
| `phone`       | Telefon (`tel:`)                                 |
| `wa`          | WhatsApp-Nummer (`wa.me` + Lead-Weiterleitung)   |
| `tg`          | Telegram-Handle (`@name`)                        |
| `ig`          | Instagram-Handle (`@name`)                       |
| `ref`         | **Reflink** – Ziel aller CTA-Buttons             |
| `cta`         | Text des Haupt-CTA-Buttons                       |
| `webinar`     | Webinar-Termin (ISO, z. B. `2026-08-15T19:00`)   |
| `countdown`   | `1` = Countdown anzeigen                         |
| `impressum`   | Impressum-URL                                    |
| `datenschutz` | Datenschutz-URL                                  |
| `video`       | URL fürs Promo-Video-iframe (optional)           |

Beispiel:

```
funnel.html?name=Max%20Mustermann&city=Berlin&ref=https://portal.kickstartercash.club/?ref=MAX&countdown=1&webinar=2026-08-15T19:00
```

## Promo-Video

Der Webinar-Bereich bettet standardmäßig das mitgelieferte Promo-Video
`promo/promo.html` ein (eine eigenständige, animierte Präsentation mit Ton).

> **Hinweis:** `promo/promo.html` lädt zur Laufzeit React und Schriften aus dem
> Netz (CDN) – auf einem echten Server mit Internet läuft es problemlos; ohne
> Internet (reines `file://` offline) bleibt der Rahmen leer.

Überschreiben/ausblenden über den Parameter `video`:

- **Standard:** `video` weglassen → `promo/promo.html` wird eingebettet.
- **Eigenes Embed:** `video=https://…` (z. B. YouTube-Embed oder `.mp4`-Seite).
- **Ausblenden:** `video=off` → Platzhalter statt Video.

Im Generator entspricht das dem Feld „Promo-Video".

## Lead-Formular

Das Anmeldeformular im Funnel funktioniert ohne Backend: Nach dem Absenden
kann der Interessent seine Daten **per WhatsApp** direkt an die hinterlegte
Nummer des Partners senden. Für eine serverseitige Speicherung (Mailtool /
CRM) kann in `funnel.js` zusätzlich ein `fetch`-POST ergänzt werden.

## Anpassen

- **Design:** zentrale Tokens in `funnel.css` bzw. `generator.css`
  (`--gold`, `--grad`, Schwarz `#0a0806` …).
- **Inhalte/Texte:** direkt in `funnel.html`.
- **Weitere Felder:** Feld in `index.html` ergänzen, Namen in
  `generator.js` (`TEXT_FIELDS`) aufnehmen und in `funnel.js` (`cfg`/`vals`)
  einbinden.
