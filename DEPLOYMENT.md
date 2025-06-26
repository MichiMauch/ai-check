# Deployment Guide

## 🚀 Vercel Deployment (Empfohlen)

### Automatisches Deployment via GitHub

1. **Vercel Account**: Gehen Sie zu [vercel.com](https://vercel.com) und melden Sie sich mit GitHub an

2. **Repository importieren**: 
   - Klicken Sie auf "New Project"
   - Wählen Sie `MichiMauch/ai-check` Repository aus
   - Klicken Sie auf "Import"

3. **Konfiguration**:
   - **Framework Preset**: Next.js (wird automatisch erkannt)
   - **Build Command**: `npm run build` (Standard)
   - **Output Directory**: `.next` (Standard)
   - **Install Command**: `npm install` (Standard)

4. **Deploy**: Klicken Sie auf "Deploy"

### Manuelles Deployment

```bash
# Vercel CLI installieren
npm i -g vercel

# Im Projektordner
vercel

# Folgen Sie den Anweisungen
```

## 🌐 Andere Deployment Optionen

### Netlify
1. Repository mit Netlify verbinden
2. Build Command: `npm run build`
3. Publish Directory: `out`
4. Zusätzlich in `next.config.js`:
   ```js
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Umgebungsvariablen

Falls Sie später eine GPT-API Integration hinzufügen:

```env
# .env.local
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📊 Performance

Das Tool ist optimiert für:
- **First Contentful Paint**: < 1.5s
- **Lighthouse Score**: 95+ 
- **Mobile-friendly**: Vollständig responsive
- **SEO**: Optimierte Meta-Tags

## 🚀 Live URL

Nach dem Vercel Deployment erhalten Sie eine URL wie:
`https://ai-check-your-username.vercel.app`

Diese können Sie dann für das Assessment verwenden!
