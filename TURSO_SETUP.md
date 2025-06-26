# Turso Datenbank Setup

Diese Anleitung erklärt, wie Sie die Turso-Datenbank für das AI Maturity Checker Tool einrichten.

## Was ist Turso?

Turso ist eine Edge-Datenbank basierend auf SQLite/LibSQL, die sich hervorragend für moderne Web-Anwendungen eignet. Sie bietet:

- Geringe Latenz durch Edge-Computing
- Einfache Skalierung
- SQLite-Kompatibilität
- Großzügiger kostenloser Tier

## Lokale Entwicklung

Für die lokale Entwicklung wird automatisch eine SQLite-Datei (`local.db`) erstellt.

### Setup:

1. Stellen Sie sicher, dass in Ihrer `.env.local` steht:
```bash
TURSO_DATABASE_URL=file:./local.db
```

2. Erstellen Sie die Tabellen:
```bash
npm run db:push
```

3. Optional: Öffnen Sie Drizzle Studio zur Datenverwaltung:
```bash
npm run db:studio
```

## Turso Cloud Setup

### 1. Turso CLI installieren

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# oder via Homebrew
brew install tursodatabase/tap/turso
```

### 2. Turso Account erstellen

```bash
turso auth signup
```

### 3. Datenbank erstellen

```bash
# Neue Datenbank erstellen
turso db create ai-maturity-checker

# Connection String abrufen
turso db show ai-maturity-checker --url

# Auth Token erstellen
turso db tokens create ai-maturity-checker
```

### 4. Umgebungsvariablen setzen

Ersetzen Sie in Ihrer `.env.local`:

```bash
# Turso Cloud Configuration
TURSO_DATABASE_URL=libsql://ai-maturity-checker-[your-username].turso.io
TURSO_AUTH_TOKEN=your-generated-token-here
```

### 5. Schema in Cloud-Datenbank deployen

```bash
npm run db:push
```

## Datenbankstruktur

### Tabellen:

#### `assessment_results`
Speichert alle Assessment-Ergebnisse mit:
- Unternehmensinformationen
- Assessment-Antworten und Scores
- AI-Empfehlungen
- User-Tracking-Daten

#### `email_leads`
Lead-Management für E-Mail-Adressen:
- E-Mail-Adressen mit Metadaten
- Verknüpfung zu Assessments
- Status-Tracking

#### `assessment_sessions`
Session-Tracking für Analytics:
- Unvollständige Sessions
- Progress-Tracking
- Resume-Funktionalität

## API-Endpunkte

### `/api/assessments` (POST)
Speichert ein komplettes Assessment-Ergebnis.

```typescript
// Request Body
{
  result: AssessmentResult,
  answers: number[],
  email?: string,
  completionTimeMs?: number
}

// Response
{
  success: true,
  assessmentId: string,
  leadId?: string
}
```

### `/api/assessments?id=xxx` (GET)
Lädt ein gespeichertes Assessment.

### `/api/save-email` (POST)
Speichert E-Mail-Lead (erweitert für Datenbankintegration).

### `/api/statistics` (GET)
Liefert Nutzungsstatistiken.

## Verfügbare Scripts

```bash
# Entwicklung
npm run db:push          # Schema in Datenbank übertragen
npm run db:generate      # Migration-Dateien generieren
npm run db:migrate       # Migrationen ausführen
npm run db:studio        # Drizzle Studio öffnen (Web-UI)
npm run db:drop          # Tabellen löschen (Vorsicht!)
```

## Produktions-Deployment

### Vercel

1. Fügen Sie die Umgebungsvariablen in Vercel hinzu:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`

2. Deploy wie gewohnt:
```bash
vercel --prod
```

### Andere Plattformen

Stellen Sie sicher, dass die Turso-Umgebungsvariablen gesetzt sind.

## Sicherheit

- Auth-Token sind sensible Daten - niemals in Code committen
- Verwenden Sie unterschiedliche Datenbanken für Dev/Staging/Prod
- Regelmäßige Backups der Produktionsdatenbank

## Monitoring

- Turso Dashboard: https://app.turso.tech/
- Drizzle Studio für lokale Entwicklung
- `/api/statistics` für App-interne Metriken

## Kosten

- Turso Free Tier: 500 MB, 1 Milliarde Row Reads/Monat
- Ideal für die meisten Use Cases
- Skalierung nach Bedarf verfügbar

## Troubleshooting

### "Database not found"
- Überprüfen Sie TURSO_DATABASE_URL
- Stellen Sie sicher, dass die Datenbank existiert

### "Auth token invalid"
- Generieren Sie einen neuen Token: `turso db tokens create <db-name>`
- Überprüfen Sie TURSO_AUTH_TOKEN

### Lokale Entwicklung Probleme
- Löschen Sie `local.db` und führen Sie `npm run db:push` erneut aus
