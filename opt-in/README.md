# Kickstarter Cash Club – Opt-in Komponente

Eine eigenständige, einbettbare Kontaktdaten-Komponente. Der User trägt
**Vorname + E-Mail** ein, stimmt der Datenspeicherung zu und wird dann zum
Funnel weitergeleitet. Optional werden die Daten vorher an ein Mailtool /
Backend geschickt.

## Dateien

| Datei          | Zweck                                            |
| -------------- | ------------------------------------------------ |
| `index.html`   | Demo-Seite, zeigt die Komponente in Aktion       |
| `opt-in.css`   | Styling (alle Klassen mit Prefix `kcc-`)         |
| `opt-in.js`    | Logik (Vanilla JS, keine Abhängigkeiten)         |

## Vorschau

`opt-in/index.html` im Browser öffnen (z. B. per Doppelklick oder
`python3 -m http.server` im Ordner).

## In die Hauptseite einbauen

1. `opt-in.css` und `opt-in.js` mit hochladen bzw. einbinden:

   ```html
   <link rel="stylesheet" href="/pfad/opt-in.css" />
   <script src="/pfad/opt-in.js" defer></script>
   ```

2. Den Komponenten-Block aus `index.html` (zwischen den Kommentaren
   `START … Opt-in-Komponente` und `ENDE …`) an die gewünschte Stelle kopieren.

3. Über die `data-`Attribute konfigurieren:

   ```html
   <section
     class="kcc-optin"
     data-funnel-url="https://portal.kickstartercash.club"
     data-webhook-url="https://dein-mailtool.de/hook">
     ...
   </section>
   ```

   | Attribut           | Bedeutung                                                                 |
   | ------------------ | ------------------------------------------------------------------------- |
   | `data-funnel-url`  | Ziel-URL, zu der nach dem Absenden weitergeleitet wird                     |
   | `data-webhook-url` | *(optional)* Endpoint, der die Kontaktdaten per `POST` (JSON) erhält       |

   Bleibt `data-webhook-url` leer, wird ohne Speicherung direkt weitergeleitet.

## Übermittelte Daten (JSON POST)

```json
{
  "name": "Max",
  "email": "max@email.de",
  "source": "kickstarter-cash-club-optin",
  "page": "https://…",
  "timestamp": "2026-07-10T12:00:00.000Z"
}
```

Als Webhook eignet sich z. B. Zapier / Make / Brevo / Mailchimp / ein
eigenes Backend. Wichtig: Für DSGVO-Konformität die Einwilligung und den
Datenschutz-Link entsprechend anpassen (`/datenschutz`).

## Design

Die Komponente ist optisch exakt an den Kickstartercash.Club-Funnel
angelehnt: Funnel-Schwarz `#0a0806`, warme Gold-Verläufe (`#EBCB72 → #B07F2A`),
die Fonts **Sora** (Headings/Text) und **Cormorant Garamond** (Serif-Akzent)
sowie der goldene CTA-Button mit Glow. So fügt sich die Box nahtlos in die
Hauptseite ein. Die Fonts werden per `@import` aus Google Fonts geladen –
ist die Komponente in den Funnel eingebettet, sind sie ohnehin schon da.

## Anpassen

- **Farben / Look:** oben in `opt-in.css` über die `--kcc-*` CSS-Variablen
  (alle Funnel-Tokens sind dort zentral gebündelt).
- **Texte:** direkt im HTML-Block (`kcc-optin__title`, `__claim`,
  `__subtitle`, Button …). Der Gold-Akzent im Titel: `kcc-optin__title-accent`.
- **Felder:** weitere Felder ergänzen; das JS liest `name`, `email`, `consent`.
