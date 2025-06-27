"use client";

import { Industry, CompanySize, CompanyInfo } from "@/types/assessment";
import { useState, useEffect } from "react";
import { Brain } from "@/components/icons";

interface CompanyInfoStepProps {
  onNext: (companyInfo: CompanyInfo) => void;
  onBack?: () => void;
}

interface IndustryData {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  sortOrder: number;
}

const COMPANY_SIZES: CompanySize[] = [
  "Kleinstunternehmen (1-9 Mitarbeiter)",
  "Kleinunternehmen (10-49 Mitarbeiter)",
  "Mittleres Unternehmen (50-249 Mitarbeiter)",
  "Großunternehmen (250-999 Mitarbeiter)",
  "Konzern (1000+ Mitarbeiter)",
];

export default function CompanyInfoStep({ onNext, onBack }: CompanyInfoStepProps) {
  const [industry, setIndustry] = useState<Industry | "">("");
  const [companySize, setCompanySize] = useState<CompanySize | "">("");
  const [industries, setIndustries] = useState<IndustryData[]>([]);
  const [loading, setLoading] = useState(true);

  // Industries von der API laden
  useEffect(() => {
    async function loadIndustries() {
      try {
        const response = await fetch('/api/industries');
        const data = await response.json();
        if (data.success) {
          setIndustries(data.industries);
        }
      } catch (error) {
        console.error('Error loading industries:', error);
        // Fallback zu hardcodierten Daten
        setIndustries([
          { id: 'it-software', name: 'IT & Software', displayName: 'IT & Software', isActive: true, sortOrder: 1 },
          { id: 'other', name: 'Sonstige', displayName: 'Sonstige', isActive: true, sortOrder: 99 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadIndustries();
  }, []);

  const handleNext = () => {
    if (industry && companySize) {
      // Industry ist jetzt die ID, nicht mehr der Name
      onNext({
        industry: industry as Industry,
        companySize: companySize as CompanySize,
      });
    }
  };

  const isFormValid = industry !== "" && companySize !== "" && !loading;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Brain className="w-8 h-8 text-primary-600" />
          <h2 className="text-3xl font-bold text-secondary-900">
            Firmenprofil
          </h2>
        </div>
        <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
          Bitte geben Sie zunächst einige Informationen zu Ihrem Unternehmen an.
          Dies hilft uns, das Assessment und die Empfehlungen zu
          personalisieren.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Branche */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            In welcher Branche ist Ihr Unternehmen tätig?
          </h3>
          <div className="relative">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as Industry)}
              className="input appearance-none pr-10"
              required
            >
              <option value="">Bitte wählen Sie eine Branche...</option>
              {loading ? (
                <option value="">Lade Branchen...</option>
              ) : (
                industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.displayName}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Firmengrösse */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Wie groß ist Ihr Unternehmen?
          </h3>
          <div className="space-y-3">
            {COMPANY_SIZES.map((size) => (
              <label
                key={size}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  companySize === size
                    ? "border-primary-500 bg-primary-50"
                    : "border-secondary-200 hover:border-primary-300 hover:bg-primary-25"
                }`}
              >
                <input
                  type="radio"
                  name="companySize"
                  value={size}
                  checked={companySize === size}
                  onChange={(e) =>
                    setCompanySize(e.target.value as CompanySize)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    companySize === size
                      ? "border-primary-500 bg-primary-500"
                      : "border-secondary-300"
                  }`}
                >
                  {companySize === size && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-secondary-900">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6">
          {/* Back Button */}
          {onBack ? (
            <button
              onClick={onBack}
              className="btn btn-secondary px-6 py-3"
            >
              Zurück
            </button>
          ) : (
            <div></div>
          )}

          {/* Weiter Button */}
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`btn btn-primary px-8 py-3 text-lg ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Weiter zur Selbsteinschätzung
          </button>
        </div>

        {!isFormValid && (
          <p className="text-sm text-secondary-500 mt-4 text-center">
            Bitte füllen Sie alle Felder aus, um fortzufahren.
          </p>
        )}
      </div>
    </div>
  );
}
