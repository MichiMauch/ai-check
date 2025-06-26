"use client";

import { useState, useEffect } from "react";
import { AssessmentResult, AI_PRODUCTS, AIProduct } from "@/types/assessment";

interface AIRecommendationsProps {
  result: AssessmentResult;
}

// Convert markdown-style formatting to HTML
const convertMarkdownToHtml = (text: string): string => {
  if (!text) return '';
  
  return text
    // Convert **bold** to <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert numbered lists (1. 2. 3.)
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li><strong>$1.</strong> $2</li>')
    // Convert bullet points (- or •)
    .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
    // Convert headers (starting with **text**: or just **text**)
    .replace(/^\*\*(.*?):\*\*$/gm, '<h4 class="font-semibold text-secondary-900 mt-6 mb-3">$1</h4>')
    .replace(/^\*\*(.*?)\*\*$/gm, '<h4 class="font-semibold text-secondary-900 mt-6 mb-3">$1</h4>')
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.includes('<li>')) {
        return `<ul class="list-none space-y-2 mb-4">${paragraph}</ul>`;
      }
      if (paragraph.includes('<h4>')) {
        return paragraph;
      }
      if (paragraph.trim()) {
        return `<p class="mb-4 leading-relaxed">${paragraph.trim()}</p>`;
      }
      return '';
    })
    .join('')
    // Clean up empty paragraphs
    .replace(/<p class="mb-4 leading-relaxed"><\/p>/g, '');
};

export default function AIRecommendations({ result }: AIRecommendationsProps) {
  const [recommendation, setRecommendation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    // E-Mail für Lead-Generierung speichern
    try {
      const response = await fetch('/api/save-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          result 
        }),
      });

      if (!response.ok) {
        console.warn('Email API not available, proceeding with unlock');
      }
      
      setEmailSubmitted(true);
    } catch (err) {
      // Fallback: auch bei API-Fehler freischalten
      console.warn('Email API not available:', err);
      setEmailSubmitted(true);
    }
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/ai-recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            result,
            includeProducts: true // Flag für erweiterte Empfehlungen
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        }

        setRecommendation(data.recommendation);
      } catch (err) {
        setError("Fehler beim Laden der AI-Empfehlungen");
        console.error("Error fetching AI recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [result]);

  return (
    <div className="space-y-6">
      {/* AI-Generated Detailed Recommendations with Email Gate */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
            🤖 Ihre personalisierte Empfehlung
          </h3>
          {error && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Fallback-Modus
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center space-x-3 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-secondary-600">
              Generiere personalisierte Empfehlungen...
            </span>
          </div>
        ) : (
          <div className="relative">
            {/* Content with HTML formatting */}
            <div
              className={`prose prose-sm max-w-none text-secondary-700 transition-all duration-300 ${
                !emailSubmitted ? "blur-sm" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(recommendation)
              }}
            />

            {/* Email Gate Overlay */}
            {!emailSubmitted && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-lg border border-secondary-200 p-6 max-w-md w-full mx-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                      🎯 Vollständige Empfehlung erhalten
                    </h4>
                    <p className="text-secondary-600 text-sm">
                      Geben Sie Ihre E-Mail-Adresse ein, um die vollständige 
                      AI-generierte Empfehlung inkl. unserer passenden Lösungen zu erhalten.
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ihre.email@unternehmen.ch"
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      {emailError && (
                        <p className="text-red-600 text-xs mt-1">{emailError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full btn btn-primary"
                    >
                      Empfehlung freischalten
                    </button>

                    <p className="text-xs text-secondary-500 text-center">
                      Ihre E-Mail wird vertraulich behandelt und nur für relevante 
                      AI-Updates verwendet.
                    </p>
                  </form>
                </div>
              </div>
            )}

            {/* Success Message */}
            {emailSubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-green-800 text-sm">
                    ✅ Vielen Dank! Ihre vollständige Empfehlung wurde freigeschaltet.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Hinweis:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
}
