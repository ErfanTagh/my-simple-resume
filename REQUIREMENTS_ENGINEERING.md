# Anforderungsanalyse

## 123Resume - Professioneller Lebenslauf-Builder

**Version:** 1.2  
**Datum:** Dezember 2025

---

## Projektübersicht

123Resume ist eine webbasierte Anwendung zum Erstellen professioneller, ATS-kompatibler Lebensläufe. Die Anwendung bietet eine mehrstufige Formularoberfläche und unterstützt das Erstellen, Bearbeiten, Anpassen von Vorlagen, PDF-Export und automatisches Parsen hochgeladener PDF-Dateien.

**Hauptfunktionen:**

- Mehrstufiger Assistent zum Erstellen von Lebensläufen
- 4 professionelle Vorlagen (Modern, Classic, Minimal, Creative)
- PDF-Generierung und Export
- Parsen von Lebensläufen aus PDF-Uploads
- Qualitätsbewertung und Feedback
- Benutzerauthentifizierung und Datenspeicherung
- Mehrsprachige Unterstützung (Deutsch/Englisch)
- Responsive Design

---

## Treiber und Ziele

### Stakeholder

Die wichtigsten Stakeholder sind Jobsuchende als primäre Nutzer, aber auch Recruiter und HR-Abteilungen profitieren von gut formatierten, ATS-kompatiblen Lebensläufen. Die Entwicklungsmannschaft benötigt einen wartbaren, skalierbaren Code, und die Geschäftsführung fokussiert sich auf Nutzerakquisition, Retention und potenzielle Einnahmen.

### Geschäftstreiber

Der Markt braucht einfache Lösungen für die Erstellung ATS-kompatibler Lebensläufe. Durch KI-gestützte Vorschläge und Qualitätsbewertung können wir uns von der Konkurrenz abheben. Die intuitive Schritt-für-Schritt-Bedienung reduziert die Einstiegshürde erheblich. Der kostenlose Basis-Service mit Option für Premium-Features ermöglicht eine breite Nutzerbasis, während die Mehrsprachigkeit (Deutsch/Englisch) den europäischen Markt adressiert.

### Projektziele

**Primär:** Nutzer sollen innerhalb von Minuten professionelle Lebensläufe erstellen können. Die Lebensläufe müssen ATS-kompatibel sein und verschiedene professionelle Vorlagen zur Verfügung stehen. Der PDF-Export muss nahtlos funktionieren, und das Parsen bestehender PDF-Lebensläufe sollte möglich sein.

**Sekundär:** Der Code soll skalierbar und wartbar sein. Die Oberfläche muss mehrsprachig sein, für mobile Geräte optimiert werden, Datensicherheit gewährleisten und Raum für zukünftige Premium-Features lassen.

### Erfolgskriterien

- Lebenslauf-Erstellung in unter 15 Minuten
- ATS-kompatible Ausgabe
- Ladezeit unter 2 Sekunden
- 99% Verfügbarkeit
- Unterstützung für 1000+ gleichzeitige Nutzer
- DSGVO-Konformität

---

## Funktionale Anforderungen

### Authentifizierung

Nutzer können sich registrieren und müssen ihre E-Mail verifizieren. Der Login erfolgt sicher mit JWT-Tokens. Passwort-Reset ist per E-Mail möglich. Die Session-Verwaltung nutzt Access- und Refresh-Tokens.

### Lebenslauf-Verwaltung

Nutzer können neue Lebensläufe über einen mehrstufigen Formular-Assistenten erstellen. Bestehende Lebensläufe können bearbeitet werden, und es gibt eine Live-Vorschau in der gewählten Vorlage. Lebensläufe können gelöscht werden (mit Bestätigungsdialog), und alle gespeicherten Lebensläufe werden mit Metadaten angezeigt. Pro Nutzer können unbegrenzt viele Lebenslauf-Versionen gespeichert werden.

### Lebenslauf-Abschnitte

Die Anwendung unterstützt folgende Abschnitte (alle mit mehreren Einträgen möglich):

- **Persönliche Informationen:** Name, E-Mail (Pflicht), Telefon, Ort, Social-Media-Links, Profilbild, Zusammenfassung, Interessen (Optional)
- **Berufserfahrung:** Position, Unternehmen, Zeitraum, Beschreibung, Verantwortlichkeiten, Technologien, Kompetenzen
- **Ausbildung:** Abschluss, Institution, Fachrichtung, Zeitraum, wichtige Kurse
- **Fähigkeiten:** Einfache Textliste
- **Sprachen:** Sprachname, Kompetenzstufe
- **Projekte:** Name, Beschreibung, Technologien, Highlights, Zeitraum, URL
- **Zertifikate:** Name, Organisation, Zeitraum, Credential-ID, URL

### Vorlagen-System

Es gibt 4 Vorlagen (Modern, Classic, Minimal, Creative) zur Auswahl mit Vorschau. Nutzer können die Reihenfolge der Abschnitte per Drag-and-Drop anpassen. Die Lebensläufe werden in der gewählten Vorlage formatiert.

### PDF-Funktionalität

Lebensläufe können als hochwertige PDF-Dateien generiert und heruntergeladen werden (ATS-optimiert). Zusätzlich können PDF-Dateien hochgeladen und automatisch in das Formular übertragen werden (Unterstützung für Deutsch und Englisch).

### Qualität und Feedback

Die Anwendung bietet eine Qualitätsbewertung basierend auf Vollständigkeit, Klarheit und Wirkung. Es gibt ATS-Optimierungsvalidierung und Warnungen bei potenziellen Problemen.

### Mehrsprachigkeit

Die Benutzeroberfläche ist auf Deutsch und Englisch verfügbar mit einem Sprachumschalter. Browser-Sprache wird automatisch erkannt.

### Content-Management

Es gibt ein Blog-System mit Artikeln zu Karriere- und Lebenslauf-Tipps, ebenfalls mehrsprachig.

### Datenspeicherung

Lebenslauf-Daten werden sicher in MongoDB gespeichert und mit Benutzerkonten verknüpft.

---

## Nicht-funktionale Anforderungen

### Performance

Die Anwendung muss schnell reagieren: Seitenladezeit unter 2 Sekunden, API-Antwortzeit unter 500ms, PDF-Generierung unter 5 Sekunden. Das System soll mindestens 1000 gleichzeitige Nutzer unterstützen und etwa 100+ Requests pro Sekunde verarbeiten können.

### Benutzerfreundlichkeit

Die Benutzeroberfläche soll intuitiv, modern gestaltet und klar strukturiert sein. Das Design ist mobile-first und funktioniert auf allen Gerätegrößen. Accessibility (WCAG 2.1 AA) ist wünschenswert, aber nicht kritisch. Die Bedienung soll selbsterklärend sein, ohne dass ein ausführliches Tutorial nötig ist.

### Zuverlässigkeit

Das System sollte eine Verfügbarkeit von 99% haben. Fehler müssen abgefangen werden und benutzerfreundliche Fehlermeldungen anzeigen. Datenintegrität wird durch Eingabevalidierung, Datenbank-Constraints und Backups gewährleistet.

### Sicherheit

Authentifizierung erfolgt sicher mit Passwort-Hashing und JWT-Tokens. Schutz vor Brute-Force-Angriffen ist implementiert. Daten werden mit HTTPS/TLS verschlüsselt übertragen und verschlüsselt gespeichert. XSS- und CSRF-Schutz sind vorhanden. Die Anwendung ist DSGVO-konform mit Datenminimierung, Einwilligungsmanagement und Löschrechten. Zugriffskontrolle basiert auf Benutzerberechtigungen mit API-Schutz und Rate-Limiting.

### Wartbarkeit

Der Code sollte sauber, in TypeScript geschrieben und modular aufgebaut sein. Die Architektur unterstützt Unit- und Integrationstests. Dokumentation (API-Docs, Code-Kommentare, Deployment-Guides) sollte vorhanden sein.

### Portabilität

Die Anwendung ist webbasiert und läuft in Docker-Containern. Sie ist mit modernen Browsern (Chrome, Firefox, Safari, Edge) kompatibel.

### Skalierbarkeit

Die Datenbank (MongoDB) nutzt effiziente Indizierung und Query-Optimierung. Die Anwendungsarchitektur ist stateless gestaltet, um horizontale Skalierung zu ermöglichen.

---

## Zukünftige Erweiterungen

Die folgenden Features wurden bewusst für spätere Versionen zurückgestellt, sind aber Teil der langfristigen Produktvision:

### Premium-Features

**Cover-Letter-Builder:** Ein zusätzliches Modul zum Erstellen von Anschreiben, die perfekt auf die erstellten Lebensläufe abgestimmt sind. Nutzer können mehrere Anschreiben-Vorlagen auswählen und ihre Lebensläufe als Grundlage verwenden.

**Erweiterte KI-Analyse:** Tiefgreifende Analyse der Lebensläufe mit detaillierten Verbesserungsvorschlägen, Keyword-Optimierung für spezifische Job-Anzeigen und Vergleich mit erfolgreichen Lebensläufen in derselben Branche.

**Resume-Analytics:** Statistiken und Insights zu den Lebensläufen - wie oft sie heruntergeladen wurden, welche Abschnitte am meisten bearbeitet werden, und Trends über die Zeit.

**Individuelles Branding:** Möglichkeit, eigene Farben, Fonts und Logo hinzuzufügen für Unternehmens- oder persönliche Branding-Zwecke.

**Prioritäts-Support:** Schnellere Antwortzeiten auf Support-Anfragen und direkter Zugang zum Support-Team.

### Funktionale Erweiterungen

**Weitere Sprachen:** Ausweitung der Mehrsprachigkeit auf weitere Sprachen wie Französisch, Spanisch oder Italienisch für den europäischen Markt.

**OCR-Funktionalität:** Unterstützung für gescannte PDF-Dateien durch optische Zeichenerkennung, damit auch alte, nur als Bild vorliegende Lebensläufe importiert werden können.

**LinkedIn-Import:** Direkter Import von Profildaten aus LinkedIn, um den Einstieg zu beschleunigen.

**Job-Board-Integrationen:** Integration mit Job-Boards wie Indeed oder Xing, um Lebensläufe direkt zu bewerben oder für spezifische Stellenanzeigen zu optimieren.

**Kollaborations-Features:** Möglichkeit, Lebensläufe mit anderen zu teilen, Feedback zu sammeln oder gemeinsam an Versionen zu arbeiten (z.B. mit Karriereberatern oder Mentoren).

**Weitere Templates:** Erweiterung der Vorlagen-Auswahl mit branchenspezifischen Designs (z.B. für Kreative, Techniker, Führungskräfte).

**Video-Integration:** Option, ein kurzes Video-Profil zum Lebenslauf hinzuzufügen oder QR-Codes zu integrieren.

**Bewerbungs-Tracking:** Ein Tool zum Verwalten von Bewerbungen - wo wurde der Lebenslauf eingereicht, Status-Tracking, Follow-up-Erinnerungen.

### Technische Verbesserungen

**Mobile Apps:** Native iOS und Android Apps für bessere mobile Nutzung.

**Offline-Modus:** Möglichkeit, Lebensläufe offline zu bearbeiten und später zu synchronisieren.

**API für Drittanbieter:** Öffentliche API, damit andere Services auf die Lebenslauf-Daten zugreifen können (z.B. für Bewerbungsplattformen).

**Erweiterte Export-Formate:** Unterstützung für Word-Dokumente, HTML-Versionen oder direktes Teilen via Link.

Diese Features sind derzeit nicht im Scope, aber wurden dokumentiert, um die Produktentwicklung langfristig zu leiten und die Vision des Produkts klar zu kommunizieren.

---

## Versionshistorie

| Version | Datum          | Änderungen                                       |
| ------- | -------------- | ------------------------------------------------ |
| 1.3     | Dezember 2025  | Abschnitt "Zukünftige Erweiterungen" hinzugefügt |
| 1.2     | Dezember 2025  | Ins Deutsche übersetzt, natürlicherer Stil       |
| 1.1     | November 2025  | Kompakte Version, weniger Details                |
| 1.0     | September 2025 | Erstes Anforderungsdokument                      |

---

**Ende des Dokuments**
