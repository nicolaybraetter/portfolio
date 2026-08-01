# DJ EXCEPT4 — Homepage Masterprompt

> **Version:** 1.0  
> **Datum:** 2026-08-01  
> **Projekt:** DJ Except4 — Moderne DJ-Homepage  
> **Domain:** djexcept4.de  
> **Deploy-Ziel:** staging1 (192.168.0.201), Port 18082  
> **E-Mail:** info@djexcept4.de (IONOS)  

---

## 1. Projektbeschreibung

Eine moderne, SEO-optimierte DJ-Homepage für **DJ Except4** — einen DJ/Producer im Bereich Uplifting Trance / Vocal Trance / Emotional Trance. Die Seite dient als zentrale Präsenz mit Musik-Player, YouTube-Integration, DistroKid-Werbemitteln, Social-Media-Links und einer vollständig administrierbaren Oberfläche.

---

## 2. Technische Architektur

### 2.1 Framework & Sprache
- **Astro** (v4+) — Static Site Generator mit Insel-Architektur
- **TypeScript** — Typsicherheit im gesamten Projekt
- **Markdown** für Content-Blöcke (Bio, Trackbeschreibungen, FAQ)

### 2.2 Styling
- **Tailwind CSS** (v4+) — Utility-First CSS Framework
- **CSS Custom Properties** (Design Tokens) für:
  - Farbschema (abgeleitet vom Wallpaper)
  - Typografie-Skalierung
  - Spacing-System
  - Border-Radius, Shadows, Transitions
- **Container Queries** für responsive Komponenten
- **Dark Mode** als Standard (Wallpaper-basiert) mit `prefers-color-scheme` Fallback

### 2.3 Audio & Player
- **Howler.js** — Cross-Browser Audio-Playback
- **WaveSurfer.js** — Visuelle Waveform-Darstellung
- Native `<audio>` Elemente als Progressive-Enhancement-Fallback

### 2.4 PWA (Progressive Web App)
- **Workbox** (via Astro Plugin) — Service Worker mit Cache-Strategie
- **Web App Manifest** — Name, Icons, Theme-Color, Display
- Offline-Fähigkeit: Cache der Kernseiten (Bio, Player, Contact)
- Installable auf Desktop und Mobile

### 2.5 i18n (Internationalisierung)
- **Astro + handgemachte Lokalisierung** mit JSON-Dateien (`/locales/de.json`, `/locales/en.json`)
- URL-basierte Sprachversionen: `/de/`, `/en/`
- Deutsch als Default, Englisch als zweite Sprache
- `lang` Attribut auf `<html>` dynamisch gesetzt

### 2.6 SEO & Structured Data
- **Schema.org** Markup:
  - `MusicGroup` (für DJ Except4 als Künstler)
  - `MusicRecording` (für einzelne Tracks)
  - `Album` (für EP/Albums, falls vorhanden)
  - `WebSite` + `Organization`
- **Open Graph Tags** auf jeder Unterseite (Dynamisch generiert)
- **Twitter Card Tags**
- **Dynamische Canonical URLs** für alle Unterseiten
- **Robots.txt** mit Sitemap-Referenz
- **sitemap.xml** — dynamisch generiert aus allen Seiten
- **404-Seite** mit korrekter HTTP-Status-Code-Rückgabe

### 2.7 Bildoptimierung
- **AVIF** als primäres Format, **WebP** als Fallback
- **Lazy Loading** für alle unterhalb der Falte liegenden Bilder
- `loading="eager"` nur für Hero-Bilder und oberste Bilder
- `decoding="async"` auf allen Bildern
- `width` und `height` Attribute auf allen `<img>` Tags (verhindert CLS)
- Responsive Bilder via `<picture>` Element mit `srcset`

---

## 3. Designsystem (abgeleitet vom Wallpaper)

### 3.1 Farbpalette (aus DJ_Except4_Wallpaper.png)

Das Wallpaper zeigt ein sehr dunkles, nahezu schwarzes Grundbild mit subtilen Neon- und Pastelakzenten. Das Design folgt diesem Farbschema:

| Rolle | Token-Name | Wert | Verwendung |
|-------|-----------|------|------------|
| Hintergrund | `--bg-primary` | `#0a0a14` | Haupthintergrund |
| Hintergrund-Alternative | `--bg-secondary` | `#0f0f1e` | Sektion-Hintergründe |
| Oberfläche | `--surface` | `#14142a` | Karten, Panels |
| Oberfläche-Hover | `--surface-hover` | `#1a1a35` | Hover-Zustände |
| Primäraczent | `--accent-cyan` | `#4dc9f6` | Links, Buttons, Highlights |
| Sekundäraczent | `--accent-pink` | `#f472b6` | CTAs, Akzente |
| Tertiäraczent | `--accent-lavender` | `#a78bfa` | Dekorative Elemente |
| Text-Primär | `--text-primary` | `#e8e8f0` | Haupttext |
| Text-Sekundär | `--text-secondary` | `#9494b8` | Nebentext, Meta |
| Text-Muted | `--text-muted` | `#6b6b8d` | Deaktivierte Zustände |
| Border | `--border` | `#2a2a4a` | Trennlinien |
| Success | `--color-success` | `#34d399` | Erfolgsmeldungen |
| Warning | `--color-warning` | `#fbbf24` | Warnhinweise |
| Error | `--color-error` | `#f87171` | Fehlermeldungen |
| Gold (Brand) | `--color-gold` | `#fbbf24` | Brand-Akzente |

### 3.2 Typografie
- **Überschriften:** Inter (oder system-ui fallback), Gewicht 700–900
- **Body-Text:** Inter, Gewicht 400–600
- **Mono/Code:** JetBrains Mono oder Fira Code
- **Responsive Skalierung:** `clamp()` für alle Schriftgrößen

### 3.3 WCAG-Konformität (AA)
- **Kontrastverhältnisse:** Alle Text-zu-Hintergrund-Kombinationen müssen ≥ 4.5:1 (normal) oder ≥ 3:1 (large text) erreichen
- **Fokus-Indikatoren:** Sichtbare `:focus-visible` Zustände auf allen interaktiven Elementen (3px Solid `--accent-cyan` mit 4px Offset)
- **Skip-Link:** "Zum Inhalt springen" als erster fokussierbarer Link
- **ARIA-Landmarks:** `role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`, `role="search"`
- **ARIA-Labels:** Alle ikonbasierten Links und Buttons haben beschreibende `aria-label`
- **Reduzierte Bewegung:** `@media (prefers-reduced-motion: reduce)` deaktiviert alle Animationen und Übergänge
- **Screenreader-Tests:** Alle Bilder haben `alt`-Attribute, dekorative Bilder haben `alt=""`

### 3.4 Responsive Breakpoints
- `sm`: 640px (Mobile Landscape)
- `md`: 768px (Tablet)
- `lg`: 1024px (Desktop)
- `xl`: 1280px (Large Desktop)
- **Mobile-First** — alle Styles starten bei `sm` und werden nach oben erweitert

---

## 4. Seitenstruktur

### 4.1 Hauptseite (`/`)
```
├── Hero-Section (DJ-Name, Tagline, CTA "Musik hören")
├── Bio-Section (Kurze Vorstellung, Genre, Stil)
├── Latest Track Section (Aktuellster Track mit Player-Vorschau)
├── Track Grid (Alle Tracks als Karten mit Cover-Art, Title, Genre)
├── Social Links Section (Instagram, DistroKid, YouTube)
├── DistroKid Ad Section (Werbemittel-Platzhalter)
├── FAQ Section (Häufige Fragen)
└── Footer (Copyright, Impressum, Datenschutz, Contact)
```

### 4.2 Unterseiten
| Pfad | Name | Beschreibung |
|------|------|-------------|
| `/de/` | Startseite | Deutsche Version |
| `/en/` | Startseite | Englische Version |
| `/de/tracks/` | Tracks | Alle Tracks als Grid |
| `/de/tracks/[slug]/` | Track-Detail | Einzelner Track mit Player, Bio, YouTube-Link |
| `/de/bio/` | Bio | Detaillierte Künstler-Biographie |
| `/de/contact/` | Kontakt | Kontaktformular + E-Mail-Display |
| `/de/impressum/` | Impressum | Rechtliche Angaben |
| `/de/datenschutz/` | Datenschutz | Datenschutzerklärung |
| `/de/medien/` | Medien | Bildergalerie mit Upload-Funktion (Admin) |
| `/404` | Nicht gefunden | 404-Fehlerseite |
| `/sitemap.xml` | Sitemap | Dynamisch generiert |

### 4.3 Canonical URLs
Jede Seite hat ein dynamisches `<link rel="canonical">` Element:
- Beispiel: `<link rel="canonical" href="https://djexcept4.de/de/tracks/bound-beneath-heavens/">`
- Die Canonical-URL berücksichtigt immer die Sprachversion und die korrekte Domain

---

## 5. Admin-Panel

### 5.1 Übersicht
Ein schlankes, Admin-only Panel unter `/admin/` (oder `/de/admin/`). Authentifizierung über ein einfaches Token-basiertes System (konfigurierbar via Umgebungsvariable `ADMIN_TOKEN`).

### 5.2 Admin-Bereiche

#### 5.2.1 Werbung (Ads)
- **Funktion:** Verwalten aller Werbelinks und Werbemittel
- **Felder pro Eintrag:**
  - Titel (Text)
  - URL (Link)
  - Beschreibung (Text)
  - Bild (Upload, max 2MB, Formate: PNG, JPG, WebP)
  - Position (Hero, Sidebar, Inline, Footer)
  - Aktiv (Boolean)
  - Start-Datum / End-Datum (optional)
- **Aktionen:** Erstellen, Bearbeiten, Löschen, Aktivieren/Deaktivieren
- **DistroKid-Werbemittel:** Spezielles Feld für DistroKid-Playlist-Links und Promo-Codes

#### 5.2.2 Medien (Media)
- **Funktion:** Upload und Verwaltung von Bildern und Grafiken
- **Upload-Funktion:**
  - Drag & Drop oder Dateiauswahl
  - Max-Dateigröße: 5MB
  - Formate: PNG, JPG, WebP, SVG, GIF
  - Automatische Konvertierung zu AVIF + WebP
  - Thumbnail-Generierung (300x300, 600x600, 1200x1200)
  - Speicherung: `/public/media/` mit UUID-basierten Dateinamen
- **Mediathek-Ansicht:**
  - Grid-Ansicht mit Thumbnails
  - Sortierbar nach Upload-Datum, Name, Dateityp
  - Suche/Filter
  - Bulk-Aktionen (Löschen, Verschieben)
  - Direkte Link-Kopie für jede Datei

#### 5.2.3 Streaming (YouTube)
- **Funktion:** Verwaltung aller YouTube-Links
- **Felder pro Eintrag:**
  - Titel (Text)
  - YouTube-Video-ID (oder volle URL)
  - Beschreibung (Text)
  - Thumbnail (automatisch von YouTube geladen, optional überschreibbar)
  - Track-Zuordnung (Dropdown: Welcher Track?)
  - Plattform-Logo (Dropdown: YouTube, DistroKid, etc.)
  - Aktiv (Boolean)
- **Vorschau:** Embedded YouTube-Player direkt im Admin
- **Aktionen:** Erstellen, Bearbeiten, Löschen, Aktivieren/Deaktivieren

#### 5.2.4 SEO-Keywords
- **Funktion:** Keyword-Pflege und -Erweiterung pro Seite
- **Ansicht:**
  - Liste aller Seiten mit zugeordneten Keywords
  - Pro Seite:
    - Meta Title (max 60 Zeichen, mit Live-Zeichenzähler)
    - Meta Description (max 160 Zeichen, mit Live-Zeichenzähler)
    - Keywords (Komma-separiert)
    - OG Title, OG Description, OG Image
    - Twitter Card Type, Title, Description
    - Canonical URL (anzeigen, nicht editierbar — wird automatisch generiert)
    - Schema.org Typ-Auswahl (WebSite, MusicGroup, MusicRecording, etc.)
- **Aktionen:** Bearbeiten, Speichern, Vorschau

#### 5.2.5 E-Mail-Postfach (info@djexcept4.de)
- **Funktion:** Eingehende Mails an info@djexcept4.de im Admin anzeigen und beantworten
- **Technik:** IMAP-Abruf (IONOS IMAP: `imap.ionos.de`, Port 993, SSL) oder SMTP-Webhook
- **Anzeige:**
  - Liste aller E-Mails (Absender, Betreff, Datum, Gelesen/Ungelesen)
  - E-Mail-Ansicht: Absender, Betreff, Datum, Body (HTML gerendert)
  - Antwort-Funktion: Antwortscreen mit Vorlage
  - Absender-Adresse: `info@djexcept4.de` (als Reply-To)
- **SMTP-Konfiguration für Antworten:**
  - **Host:** smtp.ionos.de
  - **Port:** 587 (STARTTLS) oder 465 (SSL)
  - **Benutzername:** info@djexcept4.de
  - **Passwort:** Via Umgebungsvariable `IONOS_SMTP_PASS` (nie im Code!)
  - **From:** info@djexcept4.de
  - **Reply-To:** info@djexcept4.de
- **Aktionen:** Lesen, Beantworten, Löschen, als Gelesen markieren

### 5.3 Admin-Authentifizierung
- Token-basiert: `ADMIN_TOKEN` Umgebungsvariable
- Login-Seite unter `/admin/login`
- Session via HTTP-only, Secure, SameSite=Strict Cookie
- Session-Timeout: 30 Minuten Inaktivität
- Logout-Button in der Admin-Sidebar

---

## 6. E-Mail-Konfiguration (IONOS)

### 6.1 SMTP-Details
```
Host: smtp.ionos.de
Port: 587
Sicherheit: STARTTLS
Authentifizierung: PLAIN
Benutzername: info@djexcept4.de
Passwort: ${IONOS_SMTP_PASS} (Umgebungsvariable)
Von: info@djexcept4.de
Antwort-An: info@djexcept4.de
```

### 6.2 IMAP-Details (für Postfach-Abruf)
```
Host: imap.ionos.de
Port: 993
Sicherheit: SSL/TLS
Benutzername: info@djexcept4.de
Passwort: ${IONOS_IMAP_PASS} (Umgebungsvariable)
```

### 6.3 E-Mail-Vorlagen
- **Standard-Antwort:** Professionelle, freundliche Antwort auf Deutsch und Englisch
- **Auto-Responder:** Optional konfigurierbar im Admin ("Ich habe deine Nachricht erhalten...")

---

## 7. Deployment-Konfiguration

### 7.1 Zielserver
- **Host:** staging1 (192.168.0.201)
- **SSH-User:** nicolay
- **SSH-Key:** ~/.ssh/id_ed25519_claude
- **Port:** 18082 (frei, neben kibuster-landing auf 18080)

### 7.2 Docker-Konfiguration
```yaml
# docker-compose.yml (DJ-Except4 Homepage)
version: '3.8'
services:
  dj-except4-web:
    image: nginx:alpine
    container_name: dj-except4-web
    restart: unless-stopped
    ports:
      - "18082:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 7.3 Nginx-Konfiguration
- Standard nginx:alpine Konfiguration
- Gzip/Komprimierung aktiviert
- Security Headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Static Assets: Lange Cache-TTL (1 Jahr) mit Content-Hash
- HTML: `Cache-Control: public, max-age=0, must-revalidate`

### 7.4 Build-Prozess
```bash
# Lokaler Build
npm run build

# Deploy auf staging1
rsync -avz --delete dist/ nicolay@staging1:/home/nicolay/dj-except4/dist/
ssh staging1 "docker stop dj-except4-web && docker rm dj-except4-web && docker run -d --name dj-except4-web --restart unless-stopped -p 18082:80 -v /home/nicolay/dj-except4/dist:/usr/share/nginx/html:ro -v /home/nicolay/dj-except4/nginx.conf:/etc/nginx/conf.d/default.conf:ro nginx:alpine"
```

### 7.5 NginxProxyManager (Optional)
- Wenn djexcept4.de über nginx-proxy-manager geroutet werden soll:
  - Proxy-Host: `djexcept4.de`
  - Forward to: `192.168.0.201:18082`
  - SSL via Let's Encrypt

---

## 8. Content-Anforderungen

### 8.1 Musik-Tracks (vorhanden)
| Track | Verzeichnis | Dateien |
|-------|------------|---------|
| Bound Beneath Heavens | `DJ_Except4-BBH/` | MP3, FLAC, MP4, 1000x1000 PNG, YouTube PNG, Beschreibung |
| Ghost of a Garden | `DJ_Except4-GOAG/` | MP3, FLAC, MP4, 1000x1000 PNG, YouTube PNG, Beschreibung |
| My Way to Breathe | `DJ_Except4-MWTB/` | MP3, FLAC, MP4, 1000x1000 PNG, YouTube PNG, Beschreibung |

### 8.2 Branding-Elemente (vorhanden)
| Datei | Verwendung |
|-------|-----------|
| `DJ_Except4_Wallpaper.png` | Design-Grundlage (Farbpalette) |
| `DJ_Except4-Logo.png` | Site Icon, Logo, OG Image |
| `DJ_Except4-Schriftzug.png` | Hero-Bereich, Header |
| `DJ_Except4_Wallpaper_1000.png` | Komprimierte Version für schnellere Ladezeiten |

### 8.3 Plattform-Logos (Logografik)
- **Anforderung:** Logos aller gängigen Musikplattformen (DistroKid, Spotify, Apple Music, Bandcamp, SoundCloud, YouTube Music, Amazon Music, etc.)
- **Format:** SVG bevorzugt, PNG als Fallback
- **Speicherort:** `/public/logos/` oder `/public/platforms/`
- **Hinweis:** Der Benutzer erwähnt, dass die Logografik bereits im Verzeichnis liegt — bitte prüfen und ggf. nach `/public/logos/` organisieren

### 8.4 Social-Media-Links
| Plattform | URL | Icon |
|-----------|-----|------|
| Instagram | (zu konfigurieren) | Instagram SVG |
| DistroKid | (zu konfigurieren) | DistroKid SVG |
| YouTube | (zu konfigurieren) | YouTube SVG |

### 8.5 DistroKid-Werbemittel
- DistroKid-Playlist-Links
- Promo-Codes / Landing-Page-Links
- DistroKid-Banner-Grafiken (Upload über Admin)

---

## 9. SEO-Anforderungen

### 9.1 Strukturierte Daten (Schema.org)
```json
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "DJ Except4",
  "url": "https://djexcept4.de",
  "description": "DJ & Producer für Uplifting Trance, Vocal Trance und Emotional Trance",
  "genre": "Trance, Uplifting Trance, Vocal Trance",
  "sameAs": [
    "https://www.instagram.com/...",
    "https://www.distrokid.com/...",
    "https://www.youtube.com/..."
  ],
  "member": {
    "@type": "Person",
    "name": "DJ Except4"
  },
  "album": [
    {
      "@type": "MusicAlbum",
      "name": "Bound Beneath Heavens",
      "byArtist": "DJ Except4",
      "url": "https://djexcept4.de/de/tracks/bound-beneath-heavens/",
      "datePublished": "2026",
      "genre": "Uplifting Trance"
    }
  ]
}
```

### 9.2 Open Graph (pro Seite dynamisch)
- `og:title` — Seitentitel
- `og:description` — Seitenbeschreibung
- `og:image` — OG-Image (Logo oder Track-Cover)
- `og:url` — Canonical URL
- `og:type` — `website` oder `music.song`
- `og:site_name` — "DJ Except4"
- `og:locale` — `de_DE` oder `en_US`

### 9.3 Core Web Vitals (Ziele)
| Metrik | Ziel |
|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200ms |
| TBT (Total Blocking Time) | < 200ms |

### 9.4 Weitere SEO-Anforderungen
- **Titel-Tag:** Max 60 Zeichen, einzigartig pro Seite
- **Meta Description:** Max 160 Zeichen, einzigartig pro Seite
- **Überschriften-Hierarchie:** H1 → H2 → H3 (kein H4-Übersprung)
- **Interne Verlinkung:** Alle Seiten über Navigationslinks erreichbar
- **Breadcrumb-Navigation:** Auf allen Unterseiten
- **Robots.txt:** Allow all, Sitemap-Referenz
- **404-Seite:** Benutzerfreundlich mit Link zur Startseite

---

## 10. Barrierefreiheit (WCAG 2.1 AA)

### 10.1 Wahrnehmung
- Alle Bilder haben `alt`-Attribute (dekorative Bilder: `alt=""`)
- Farbe ist nicht alleiniges Mittel zur Informationsübermittlung
- Textkontrast ≥ 4.5:1 (normal text) und ≥ 3:1 (large text)
- Text kann ohne CSS verkleinert werden bis 200% ohne Datenverlust

### 10.2 Bedienbarkeit
- Alle interaktiven Elemente erreichbar via Tastatur
- Fokus-Indikator sichtbar auf allen fokussierbaren Elementen
- Kein Keyboard-Trap
- Überspring-Links ("Zum Inhalt springen")
- Timing-independent: Keine zeitlich begrenzten Inhalte ohne Pause/Deaktivierung

### 10.3 Verständlichkeit
- Sprache der Seite im `lang`-Attribut deklariert
- Unklare Begriffe erklärt oder auf Deutsch/Englisch definiert
- Konsistente Navigation

### 10.4 Robustheit
- Validiertes HTML5 und CSS
- ARIA-Labels korrekt verwendet (nicht überstrapaziert)
- Kompatibel mit gängigen Screenreadern

---

## 11. Mobile-Bereitschaft

### 11.1 Anforderungen
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Touch-Targets:** Mindestens 44x44px für alle interaktiven Elemente
- **Schriftgröße:** Mindestens 16px Body-Text (verhindert Auto-Zoom auf iOS)
- **Horizontal Scroll:** Keine — alle Inhalte passen in die Viewport-Breite
- **Hamburger-Menü:** Auf Mobile (< 768px) Navigation als Hamburger-Menü
- **Touch-Gesten:** Swipe-Unterstützung für Track-Player (vorwärts/zurück)
- **Performance:** Alle Ressourcen < 100KB komprimiert, lazy loading aktiv

### 11.2 Testgeräte (emuliert)
- iPhone SE (375px)
- iPhone 14 Pro (393px)
- iPad (768px)
- Android Mobile (360px)
- Desktop (1440px)

---

## 12. Projektstruktur

```
dj-except4/
├── astro.config.mjs          # Astro-Konfiguration
├── tailwind.config.js         # Tailwind-Konfiguration
├── package.json               # Abhängigkeiten und Scripts
├── tsconfig.json              # TypeScript-Konfiguration
├── .env.example               # Umgebungsvariablen-Vorlage
├── .env                       # (nicht versioniert) Umgebungsvariablen
├── nginx.conf                 # Nginx-Konfiguration für Docker
├── Dockerfile                 # (optional) Für erweiterte Builds
├── docker-compose.yml         # Docker Compose für lokalen Test
├── public/
│   ├── favicon.ico
│   ├── icons/                 # PWA Icons (192x192, 512x512)
│   ├── og-image.png           # Default OG Image
│   ├── logos/                 # Plattform-Logos (SVG/PNG)
│   └── media/                 # Upload-Verzeichnis für Admin-Medien
├── src/
│   ├── layouts/
│   │   ├── Layout.astro       # Haupt-Layout
│   │   └── AdminLayout.astro  # Admin-Layout
│   ├── pages/
│   │   ├── index.astro        # Startseite (DE)
│   │   ├── en/
│   │   │   └── index.astro    # Startseite (EN)
│   │   ├── de/
│   │   │   ├── tracks/
│   │   │   │   ├── index.astro
│   │   │   │   └── [slug].astro
│   │   │   ├── bio.astro
│   │   │   ├── contact.astro
│   │   │   ├── impressum.astro
│   │   │   ├── datenschutz.astro
│   │   │   └── medien.astro
│   │   ├── en/
│   │   │   ├── tracks/
│   │   │   ├── bio.astro
│   │   │   ├── contact.astro
│   │   │   ├── impressum.astro
│   │   │   └── datenschutz.astro
│   │   ├── admin/
│   │   │   ├── index.astro
│   │   │   ├── login.astro
│   │   │   ├── werbung/
│   │   │   ├── medien/
│   │   │   ├── streaming/
│   │   │   ├── seo/
│   │   │   └── email/
│   │   ├── 404.astro
│   │   └── sitemap.xml.astro
│   ├── components/
│   │   ├── Player.astro       # Audio-Player-Komponente
│   │   ├── Waveform.astro     # Waveform-Visualisierung
│   │   ├── TrackCard.astro    # Track-Karten-Komponente
│   │   ├── SocialLinks.astro  # Social-Media-Links
│   │   ├── SEOHead.astro      # Dynamische SEO-Head-Komponente
│   │   ├── AdminSidebar.astro # Admin-Sidebar
│   │   └── ContactForm.astro  # Kontaktformular
│   ├── data/
│   │   ├── tracks.json        # Track-Daten (von Admin editierbar)
│   │   ├── ads.json           # Werbedaten
│   │   ├── media.json         # Medien-Datenbank
│   │   ├── seo.json           # SEO-Daten pro Seite
│   │   └── social.json        # Social-Media-Links
│   ├── i18n/
│   │   ├── de.json            # Deutsche Übersetzungen
│   │   └── en.json            # Englische Übersetzungen
│   ├── styles/
│   │   └── global.css         # Globale Styles + Tailwind directives
│   └── scripts/
│       ├── player.js          # Howler.js + WaveSurfer.js Initialisierung
│       ├── admin.js           # Admin-Panel Logik
│       ├── upload.js          # Medien-Upload-Logik
│       └── email.js           # E-Mail IMAP/SMTP Logik
├── testing/                   # Isolierte Tests und Demos
│   ├── player-test/
│   ├── dark-mode-test/
│   └── seo-test/
├── dist/                      # Build-Output (nicht versioniert)
└── .gitignore
```

---

## 13. Test-Anforderungen

### 13.1 Test-Verzeichnis
Alle Tests und isolierten Demos im `testing/` Unterverzeichnis, getrennt von der Produktion.

### 13.2 Testarten
- **Lighthouse CI:** Performance, SEO, Accessibility, Best Practices
- **Playwright E2E:** Kritische User-Journeys (Homepage, Player, Admin-Login, Kontaktformular)
- **Manuelle Tests:**
  - Mobile (iOS Safari, Android Chrome)
  - Desktop (Chrome, Firefox, Safari, Edge)
  - Screenreader (NVDA/VoiceOver)
  - Farbkontrast-Prüfung (WCAG AA)

### 13.3 Lokaler Test-Server
```bash
# Lokaler Test mit Python (kein Build nötig)
python3 -m http.server 8080

# Oder mit Astro Dev Server
npm run dev
```

---

## 14. Abhängigkeiten (npm)

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "tailwindcss": "^4.x",
    "howler": "^2.2.x",
    "wavesurfer.js": "^7.x",
    "workbox-window": "^7.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/howler": "^2.2.x",
    "playwright": "^1.x",
    "lighthouse": "^12.x"
  }
}
```

---

## 15. Checkliste für die Implementierung

- [ ] Projekt initialisieren (`npm create astro@latest`)
- [ ] Tailwind CSS konfigurieren (v4)
- [ ] Design Tokens basierend auf Wallpaper-Farbpalette definieren
- [ ] Layout-Komponenten erstellen (Header, Footer, Navigation)
- [ ] Startseite mit Hero, Bio, Track-Grid, Social Links
- [ ] Audio-Player (Howler.js + WaveSurfer.js) integrieren
- [ ] Track-Detailseiten erstellen
- [ ] i18n (DE/EN) implementieren
- [ ] SEO (Schema.org, OG Tags, Canonicals, Sitemap) implementieren
- [ ] PWA (Manifest, Service Worker) einrichten
- [ ] Admin-Panel (Werbung, Medien, Streaming, SEO, E-Mail)
- [ ] Medien-Upload mit AVIF/WebP-Konvertierung
- [ ] E-Mail-Postfach (IMAP-Abruf + SMTP-Antwort)
- [ ] WCAG 2.1 AA Compliance prüfen
- [ ] Mobile-Responsiveness testen
- [ ] Lighthouse-Audit bestehen (≥ 90 in allen Kategorien)
- [ ] Docker nginx:alpine Konfiguration erstellen
- [ ] Deploy auf staging1 (Port 18082) testen
- [ ] NginxProxyManager-Setup (optional)
- [ ] testing/ Subdir einrichten

---

## 16. Hinweise

1. **Keine externe Datenbank** — Alle Daten (Tracks, Ads, SEO, Medien-Metadaten) als JSON-Dateien im `src/data/` Verzeichnis. Der Admin bearbeitet diese direkt oder die Daten werden in localStorage + JSON-Datei-Sync gespeichert.

2. **Port 18082** ist auf staging1 frei und wurde als Deploy-Port gewählt.

3. **IONOS E-Mail** — Die SMTP/IMAP-Zugangsdaten für info@djexcept4.de müssen vom Benutzer in `.env` eingetragen werden. Kein Passwort im Code!

4. **Plattform-Logos** — Die Logografik für Musikplattformen wird als SVG/PNG im `public/logos/` Verzeichnis erwartet. Falls noch nicht vorhanden, bitte bereitstellen.

5. **DistroKid-Werbemittel** — DistroKid bietet umfangreiche Werbepakete. Die Admin-Oberfläche unterstützt das Einpflegen von DistroKid-Links, Promo-Codes und Banner-Grafiken.

6. **Lokale Entwicklung** — `npm run dev` startet den Astro Dev Server. `python3 -m http.server 8080` dient als schneller Test-Server für statische Dateien.

7. **Git** — Lokales Repository, kein Remote. Änderungen werden via rsync auf staging1 deployt.
