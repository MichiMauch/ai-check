# 🤖 OpenAI API Integration Setup

## Für AI-Powered Empfehlungen konfigurieren

### 1. OpenAI API Key erhalten

1. Gehen Sie zu [OpenAI Platform](https://platform.openai.com)
2. Erstellen Sie ein Konto oder melden Sie sich an
3. Navigieren Sie zu **API Keys** im Dashboard
4. Klicken Sie auf **"Create new secret key"**
5. Kopieren Sie den generierten API Key

### 2. Lokale Entwicklung

```bash
# 1. Kopieren Sie die Beispiel-Umgebungsdatei
cp .env.local.example .env.local

# 2. Bearbeiten Sie .env.local und fügen Sie Ihren API Key hinzu
# OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Produktions-Deployment

#### Vercel
```bash
# Über CLI
vercel env add OPENAI_API_KEY

# Oder im Vercel Dashboard:
# Settings > Environment Variables
# Name: OPENAI_API_KEY
# Value: sk-your-actual-api-key-here
```

#### Andere Plattformen
Fügen Sie die Umgebungsvariable in Ihrem Hosting-Dashboard hinzu:
- **Netlify**: Site settings > Environment variables
- **Railway**: Variables tab
- **Docker**: docker run -e OPENAI_API_KEY=...

### 4. Kosten-Optimierung

```javascript
// In .env.local können Sie das Modell anpassen:
OPENAI_MODEL=gpt-3.5-turbo  // Günstiger (Standard)
// oder
OPENAI_MODEL=gpt-4          // Teurer, aber bessere Qualität
```

### 5. Fallback-Verhalten

**Ohne API Key:**
- Tool funktioniert trotzdem vollständig
- Zeigt statische, regelbasierte Empfehlungen
- Benutzer sieht Hinweis "Fallback-Modus"

**Mit API Key:**
- Personalisierte, kontextuelle AI-Empfehlungen
- Branchenspezifische Insights
- Dynamische Produktempfehlungen

### 6. Rate Limits & Monitoring

- **gpt-3.5-turbo**: ~20 Anfragen/Minute (Tier 1)
- **Monitoring**: OpenAI Dashboard zeigt Nutzung
- **Budget**: Setzen Sie Limits im OpenAI Dashboard

### 7. Sicherheit

```bash
# Nie in Git committen!
echo ".env.local" >> .gitignore

# API Key rotieren wenn kompromittiert
# Im OpenAI Dashboard: Delete + Create new key
```

## 💡 Tipps

- **Entwicklung**: Verwenden Sie gpt-3.5-turbo (günstiger)
- **Produktion**: gpt-4 für bessere Qualität erwägen
- **Caching**: Empfehlungen können gecacht werden
- **Personalisierung**: Nutzen Sie die Assessment-Daten optimal

Das Tool funktioniert auch **ohne OpenAI API** mit intelligenten Fallback-Empfehlungen!
