# AI Maturity Checker

Ein interaktives Tool zur Einschätzung des digitalen Reifegrads eines Unternehmens im Bereich Künstliche Intelligenz (AI).

## 🚀 Features

- **Firmenprofil**: Branche und Unternehmensgröße für personalisierte Empfehlungen
- **Selbsteinschätzung**: Spontane Auswahl einer von fünf AI-Maturity-Stufen
- **15 Assessment-Fragen**: Detaillierte Bewertung auf einer 5-Punkte-Skala
- **Automatische Auswertung**: Intelligente Berechnung des tatsächlichen Reifegrads
- **AI-Powered Empfehlungen**: GPT-basierte, personalisierte Handlungsempfehlungen
- **Produktempfehlungen**: Maßgeschneiderte Lösungsvorschläge basierend auf Assessment
- **Tastatur-Navigation**: Schnelle Eingabe mit Zifferntasten 1-5
- **Responsive Design**: Optimiert für alle Geräte

## 🏗️ Technologie-Stack

- **Next.js 14** mit App Router
- **React 18** mit TypeScript
- **Tailwind CSS** für modernes, responsives Design
- **Lucide React** für Icons (optional)

## 📊 AI-Maturity-Stufen

1. **Digital AI Resister** (0-15 Punkte) - Keine oder sehr begrenzte AI-Nutzung
2. **Digital AI Explorer** (16-30 Punkte) - Erste Schritte und Experimente
3. **Digital AI Player** (31-45 Punkte) - Strukturierte Herangehensweise
4. **Digital AI Transformer** (46-60 Punkte) - AI als strategisches Kernelement
5. **Digital AI Disrupter** (61-75 Punkte) - AI treibt Geschäftsmodellinnovation

## 🚦 Installation & Start

1. **Dependencies installieren:**

   ```bash
   npm install
   ```

2. **Development Server starten:**

   ```bash
   npm run dev
   ```

3. **Öffnen Sie den Browser:**
   ```
   http://localhost:3000
   ```

## 📁 Projektstruktur

```
ai-check/
├── app/                    # Next.js App Router
│   ├── globals.css        # Globale Styles mit Tailwind
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Homepage
├── components/            # React Komponenten
│   ├── AssessmentTool.tsx # Haupt-Assessment Tool
│   ├── SelfAssessmentStep.tsx
│   ├── AssessmentQuestionsStep.tsx
│   ├── ResultsStep.tsx
│   └── icons.tsx          # Custom Icon Komponenten
├── lib/                   # Utility Bibliotheken
│   └── assessment-calculator.ts
├── types/                 # TypeScript Definitionen
│   └── assessment.ts
└── README.md
```

## 🎯 Funktionsweise

### 1. Selbsteinschätzung

Der Nutzer wählt spontan eine AI-Maturity-Stufe aus, die sein Unternehmen am besten beschreibt.

### 2. Assessment-Fragen

15 sorgfältig ausgewählte Fragen (je 3 pro Maturity-Stufe) werden auf einer Skala von 1-5 bewertet.

### 3. Automatische Auswertung

- Summierung aller Antworten (max. 75 Punkte)
- Zuordnung zur entsprechenden AI-Maturity-Stufe
- Berechnung der Abweichung zur Selbsteinschätzung

### 4. Ergebnisse & Insights

Strukturierte Ausgabe mit:

- Berechneter Reifegrad vs. Selbsteinschätzung
- Detaillierte Insights zur Abweichung
- Konkrete Handlungsempfehlungen
- Charakteristika der erreichten Stufe

## 📱 Responsive Design

Das Tool ist vollständig responsive und für mobile Nutzung optimiert:

- Moderne, klare Benutzeroberfläche
- Schritt-für-Schritt-Nutzerführung mit Fortschrittsanzeige
- Dezente Animationen für besseres Nutzererlebnis
- Optimierte Touch-Bedienung für mobile Geräte

## 🔧 Anpassungen

### Fragen erweitern

Neue Assessment-Fragen können in `types/assessment.ts` hinzugefügt werden.

### Bewertungslogik anpassen

Die Berechnungslogik befindet sich in `lib/assessment-calculator.ts`.

### Design customizen

Tailwind-Konfiguration in `tailwind.config.js` anpassen.

## 🚀 Deployment

### Vercel (empfohlen)

```bash
npm run build
npx vercel
```

### Andere Plattformen

```bash
npm run build
npm start
```

## 🔮 Erweitungsmöglichkeiten

- **GPT-API Integration** für intelligentere Insights
- **PDF-Export** der Ergebnisse
- **Team-Assessment** für mehrere Teilnehmer
- **Benchmark-Daten** im Branchenvergleich
- **Tracking** der Fortschritte über Zeit

## 📄 Lizenz

Dieses Projekt ist für den internen Gebrauch entwickelt.

---

**Entwickelt für digitale Transformation** 🤖
