# Vercel Deployment Guide mit Turso Database

Diese Anleitung führt Sie durch das komplette Setup für das Deployment Ihres AI Maturity Checkers auf Vercel mit Turso-Datenbank.

## 📋 Voraussetzungen

- GitHub Repository ist aktuell (✅ erledigt)
- Vercel Account: https://vercel.com
- Turso Account: https://turso.tech

## 🗄️ SCHRITT 1: Turso Cloud Database Setup

### 1.1 Turso CLI installieren

```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# oder via Homebrew (macOS)
brew install tursodatabase/tap/turso

# Windows (PowerShell)
iwr https://get.tur.so/install.ps1 | iex
```

### 1.2 Turso Account erstellen und einloggen

```bash
# Account erstellen (öffnet Browser)
turso auth signup

# Einloggen (falls Account bereits existiert)
turso auth login
```

### 1.3 Produktions-Datenbank erstellen

```bash
# Datenbank erstellen
turso db create ai-maturity-checker-prod

# Datenbank-URL abrufen
turso db show ai-maturity-checker-prod --url

# Auth Token generieren
turso db tokens create ai-maturity-checker-prod
```

**Wichtig:** Notieren Sie sich:
- **Database URL** (beginnt mit `libsql://...`)
- **Auth Token** (beginnt meist mit `eyJ...`)

### 1.4 Schema in Turso-Datenbank deployen

```bash
# Lokal: Umgebungsvariablen temporär setzen
export TURSO_DATABASE_URL="libsql://ai-maturity-checker-prod-[username].turso.io"
export TURSO_AUTH_TOKEN="Ihr-Auth-Token-hier"

# Schema deployen
npm run db:push

# Erfolg prüfen
turso db shell ai-maturity-checker-prod ".tables"
```

## 🚀 SCHRITT 2: Vercel Deployment

### 2.1 Projekt zu Vercel importieren

1. Gehen Sie zu https://vercel.com/dashboard
2. Klicken Sie auf **"New Project"**
3. Wählen Sie Ihr GitHub Repository: `ai-check`
4. Klicken Sie auf **"Import"**

### 2.2 Umgebungsvariablen in Vercel setzen

**Gehen Sie zu:** Project Settings → Environment Variables

**Erforderliche Variablen:**

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-[Ihr-OpenAI-Key]
OPENAI_MODEL=gpt-4

# App Configuration
NEXT_PUBLIC_APP_URL=https://ihr-projekt-name.vercel.app

# Turso Database (WICHTIG!)
TURSO_DATABASE_URL=libsql://ai-maturity-checker-prod-[username].turso.io
TURSO_AUTH_TOKEN=Ihr-Auth-Token-hier
```

### 2.3 Deployment starten

1. Klicken Sie auf **"Deploy"**
2. Warten Sie auf erfolgreiches Deployment
3. Testen Sie die URL

## ✅ SCHRITT 3: Funktionstest

### 3.1 Basic Test

1. Öffnen Sie Ihre Vercel-URL
2. Führen Sie ein komplettes Assessment durch
3. Prüfen Sie, ob alle Features funktionieren

### 3.2 Datenbank-Test

```bash
# Prüfen Sie, ob Daten gespeichert werden
turso db shell ai-maturity-checker-prod "SELECT COUNT(*) FROM assessment_results;"

# Letzte Assessments anzeigen
turso db shell ai-maturity-checker-prod "SELECT created_at, industry, calculated_level FROM assessment_results ORDER BY created_at DESC LIMIT 5;"
```

### 3.3 API-Test

```bash
# Statistiken abrufen
curl "https://ihr-projekt-name.vercel.app/api/statistics"
```

## 📊 SCHRITT 4: Monitoring Setup

### 4.1 Turso Dashboard

- Gehen Sie zu: https://app.turso.tech/
- Überwachen Sie Database Usage, Requests, etc.

### 4.2 Vercel Analytics (Optional)

1. Gehen Sie zu Project Settings → Analytics
2. Aktivieren Sie Web Analytics
3. Optional: Speed Insights aktivieren

## 🔧 SCHRITT 5: Domain Setup (Optional)

### 5.1 Custom Domain hinzufügen

1. Project Settings → Domains
2. Fügen Sie Ihre Domain hinzu
3. Folgen Sie den DNS-Anweisungen

### 5.2 Environment Variables anpassen

```bash
# Update NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_URL=https://ihre-domain.com
```

## 🚨 Troubleshooting

### Database Connection Fehler

```bash
# Prüfen Sie die Variablen
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN

# Neue Token generieren falls nötig
turso db tokens create ai-maturity-checker-prod

# In Vercel Environment Variables aktualisieren
```

### Deployment Fehler

1. **Build Fehler:** Prüfen Sie Build Logs in Vercel
2. **Database Fehler:** Überprüfen Sie Turso-Credentials
3. **API Fehler:** Schauen Sie in Function Logs

### Performance Issues

1. **Turso Location:** Erstellen Sie Replicas näher zu Ihrer Zielgruppe
2. **Vercel Region:** Wählen Sie passende Deployment-Region

## 📈 SCHRITT 6: Produktions-Optimierungen

### 6.1 Turso Replicas (für bessere Performance)

```bash
# Replica in gewünschter Region erstellen
turso db replicate ai-maturity-checker-prod --to fra

# Alle Locations anzeigen
turso db locations
```

### 6.2 Monitoring & Alerts

1. **Turso:** Überwachen Sie Usage und Performance
2. **Vercel:** Function Duration und Error Rates
3. **OpenAI:** API Usage über OpenAI Dashboard

### 6.3 Backup Strategy

```bash
# Regelmäßige Backups
turso db shell ai-maturity-checker-prod .dump > backup-$(date +%Y%m%d).sql
```

## 🎯 Checkliste für Go-Live

- [ ] Turso-Datenbank erstellt und Schema deployed
- [ ] Vercel-Projekt erfolgreich deployed
- [ ] Alle Environment Variables korrekt gesetzt
- [ ] Assessment-Flow funktional getestet
- [ ] E-Mail-Lead-Capturing getestet
- [ ] AI-Empfehlungen funktionieren
- [ ] Database-Logging funktioniert
- [ ] Custom Domain konfiguriert (optional)
- [ ] Monitoring eingerichtet

## 💰 Kostenübersicht

### Turso (Free Tier)
- **500 MB Storage**
- **1 Billion Row Reads/Monat**
- **Ideal für Start und Testing**

### Vercel (Hobby Plan - Free)
- **100 GB Bandwidth**
- **1000 Serverless Function Invocations/Tag**
- **Für die meisten Use Cases ausreichend**

### OpenAI
- **Pay-per-Use**
- **GPT-4: ~$0.03 per 1K tokens**
- **Monitoring über OpenAI Dashboard**

---

**🎉 Nach Abschluss haben Sie eine vollständig funktionale, skalierbare AI Maturity Checker App mit professionellem Database-Backend!**
