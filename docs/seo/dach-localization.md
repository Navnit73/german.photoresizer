# DACH Localisation & Compliance Guidelines

> Verbindliche Leitlinien für Deutschland (DE), Österreich (AT) und die Schweiz (CH).


## 1. Rechtliche Pflichtangaben (Blocking Pre-Launch)

### 1.1 Impressumspflicht
- **Deutschland:** § 5 Digitale-Dienste-Gesetz (DDG)
- **Österreich:** § 5 E-Commerce-Gesetz (ECG) und § 25 Mediengesetz (MedienG)
- **Schweiz:** Art. 3 Abs. 1 lit. s Bundesgesetz gegen den unlauteren Wettbewerb (UWG)
- **Umsetzung:**
  - Eigene Seite `/impressum/`
  - Von jeder Seite mit einem Klick erreichbar (Footer)
  - Vollständiger Name, ladungsfähige Anschrift, E-Mail-Adresse, Telefonnummer, Registereintrag (falls vorhanden)

### 1.2 Datenschutz (DSGVO & Schweizer revDSG)
- **EU/DACH:** Datenschutz-Grundverordnung (DSGVO)
- **Schweiz:** Revidiertes Datenschutzgesetz (revDSG)
- **Umsetzung:**
  - Eigene Seite `/datenschutz/`
  - Transparente Erklärung des Verarbeitungsortes:
    > „Ihre Bilder werden direkt in Ihrem Browser (Client-side) verarbeitet und nicht auf unsere Server übertragen.“
  - Bei serverseitigen KI-Modellen: Explizite Angabe des Verarbeitungsstandorts (z. B. EU-Server) und sofortige automatische Löschung nach der Berechnung.

### 1.3 Cookie-Einwilligung
- **Deutschland:** Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG)
- **Österreich:** Telekommunikationsgesetz 2021 (TKG 2021)
- **Umsetzung:**
  - Einwilligung vor dem Setzen nicht-essentieller Cookies / Tracking
  - Bevorzugte Lösung: Cookielose Web-Analytics (z. B. Plausible, Cloudflare Web Analytics), um Consent-Banner für maximale Usability zu vermeiden.

---

## 2. Sprach- und Rechtschreib-Regeln

### 2.1 Anrede
- Durchgängig professionelles und vertrauenswürdiges **„Sie“**. Niemals mit „du“ mischen.

### 2.2 Schweizer Rechtschreibung („ß“ vs. „ss“)
- In der Schweiz existiert kein „ß“.
- **Hauptversion:** Standard-Hochdeutsch nach Duden mit „ß“ (z. B. *groß, schließen, regelmäßig*).
- **Suchvolumen-Abdeckung:** CH-Schreibweisen wie *„bildgrösse ändern“* (500 Suchanfragen/Monat) werden natürlich im Fließtext und in FAQs erwähnt.
- **Zukunft:** Optional eigene `de-CH` URL-Version für die Top-10-Seiten via hreflang (`hreflang="de-CH"`).

### 2.3 Zahlen- und Datumsformate
- **Zahlenformat:** Dezimalkomma und Tausenderpunkt (z. B. `1,5 MB`, `1.000 KB`).
- **Schweiz-Option:** In CH wird häufig der Hochkomma-Trennstrich verwendet (`1’000 KB`).
- **Maßeinheiten:** Metrische Einheiten zuerst (`cm`, `mm`, `Pixel`). DIN-Formate nach ISO 216 (`DIN A4`, `DIN A6`).

---

## 3. Amtliche Vorgaben (Passfotos, Dokumente)

> **Wichtiger Grundsatz:** Keine Garantie für behördliche Zulassung aussprechen!

- Bei Passbild-Tools und Maßangaben immer auf offizielle Stellen verlinken:
  - **Deutschland:** Bundesministerium des Innern / Bundesdruckerei (Passbildkriterien)
  - **Österreich:** oesterreich.gv.at (Passbildkriterien)
  - **Schweiz:** fedpol / schweizerpass.admin.ch (Fotomustertabelle)
- Disclaimer:
  > „Dieses Tool unterstützt Sie beim Zuschnitt auf die Standardmaße 35 × 45 mm. Prüfen Sie bitte stets die aktuellen biometrischen Vorgaben Ihrer zuständigen Passbehörde.“
