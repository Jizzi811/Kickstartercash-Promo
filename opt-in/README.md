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
     data-funnel-url="https://kickstarterai.net/funnel"
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

## Anpassen

- **Farben / Look:** oben in `opt-in.css` über die `--kcc-*` CSS-Variablen.
- **Texte:** direkt im HTML-Block (`kcc-optin__title`, `__subtitle`, Button …).
- **Felder:** weitere Felder ergänzen; das JS liest `name`, `email`, `consent`.
