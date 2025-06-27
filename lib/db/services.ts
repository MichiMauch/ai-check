import { v4 as uuidv4 } from 'uuid';
import { eq, desc, and, gte, count } from 'drizzle-orm';
import { getDB, schema } from './client';
import type { AssessmentResult as AssessmentResultType } from '@/types/assessment';

export class AssessmentService {
  private db = getDB();

  // Helper: Industry Name zu ID mappen
  private mapIndustryNameToId(industryName: string): string {
    const mapping: Record<string, string> = {
      'Automotive': 'automotive',
      'Banking & Finance': 'banking-finance',
      'Beratung & Consulting': 'consulting',
      'Bildung & Forschung': 'education',
      'Chemie & Pharma': 'chemical-pharma',
      'Einzelhandel': 'retail',
      'Energie & Umwelt': 'energy',
      'Gesundheitswesen': 'healthcare',
      'IT & Software': 'it-software',
      'Logistik & Transport': 'logistics',
      'Maschinenbau': 'manufacturing',
      'Medien & Marketing': 'media',
      'Öffentliche Verwaltung': 'public',
      'Produktion & Fertigung': 'production',
      'Telekommunikation': 'telecom',
      'Tourismus & Gastronomie': 'tourism',
      'Versicherung': 'insurance',
      'Sonstige': 'other',
    };
    return mapping[industryName] || 'other';
  }

  // Assessment speichern
  async saveAssessment(
    result: AssessmentResultType,
    metadata: {
      email?: string;
      ipAddress?: string;
      userAgent?: string;
      completionTimeMs?: number;
      answers: number[]; // Array der Antwort-Scores
    }
  ) {
    const id = uuidv4();
    
    const assessmentData = {
      id,
      industryId: result.company_info.industry, // Jetzt ist es bereits eine ID
      companySize: result.company_info.companySize,
      selfAssessment: result.self_assessment,
      calculatedLevel: result.calculated_level,
      score: result.score,
      maxScore: 75,
      answers: metadata.answers,
      insight: result.insight,
      delta: result.delta,
      nextSteps: result.next_steps,
      email: metadata.email,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      completionTimeMs: metadata.completionTimeMs,
    };

    await this.db.insert(schema.assessmentResults).values(assessmentData);
    
    return id;
  }

  // Assessment mit AI-Empfehlung aktualisieren
  async updateWithAIRecommendation(
    assessmentId: string,
    aiRecommendation: string,
    recommendedProductIds: string[]
  ) {
    await this.db
      .update(schema.assessmentResults)
      .set({
        aiRecommendation,
        recommendedProducts: recommendedProductIds,
      })
      .where(eq(schema.assessmentResults.id, assessmentId));
  }

  // Assessment abrufen
  async getAssessment(id: string) {
    const results = await this.db
      .select()
      .from(schema.assessmentResults)
      .where(eq(schema.assessmentResults.id, id))
      .limit(1);
    
    return results[0] || null;
  }

  // Letzte Assessments für eine E-Mail
  async getAssessmentsByEmail(email: string, limit = 5) {
    return await this.db
      .select()
      .from(schema.assessmentResults)
      .where(eq(schema.assessmentResults.email, email))
      .orderBy(desc(schema.assessmentResults.createdAt))
      .limit(limit);
  }

  // Statistiken abrufen
  async getStatistics() {
    const totalAssessments = await this.db
      .select({ count: count() })
      .from(schema.assessmentResults);

    const byLevel = await this.db
      .select({
        level: schema.assessmentResults.calculatedLevel,
        count: count(),
      })
      .from(schema.assessmentResults)
      .groupBy(schema.assessmentResults.calculatedLevel);

    const byIndustry = await this.db
      .select({
        industry: schema.industries.displayName,
        count: count(),
      })
      .from(schema.assessmentResults)
      .innerJoin(schema.industries, eq(schema.assessmentResults.industryId, schema.industries.id))
      .groupBy(schema.industries.id, schema.industries.displayName);

    const recentAssessments = await this.db
      .select({ count: count() })
      .from(schema.assessmentResults)
      .where(gte(schema.assessmentResults.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()));

    return {
      total: totalAssessments[0]?.count || 0,
      recentWeek: recentAssessments[0]?.count || 0,
      byLevel,
      byIndustry,
    };
  }

  // Admin-spezifische Methoden
  async getTotalAssessments() {
    const result = await this.db
      .select({ count: count() })
      .from(schema.assessmentResults);
    return result[0]?.count || 0;
  }

  async getStatsByIndustry() {
    return await this.db
      .select({
        industry: schema.industries.displayName,
        industryId: schema.industries.id,
        count: count(),
      })
      .from(schema.assessmentResults)
      .innerJoin(schema.industries, eq(schema.assessmentResults.industryId, schema.industries.id))
      .groupBy(schema.industries.id, schema.industries.displayName)
      .orderBy(desc(count()));
  }

  async getStatsByLevel() {
    return await this.db
      .select({
        level: schema.assessmentResults.calculatedLevel,
        count: count(),
      })
      .from(schema.assessmentResults)
      .groupBy(schema.assessmentResults.calculatedLevel)
      .orderBy(desc(count()));
  }

  async getStatsByCompanySize() {
    return await this.db
      .select({
        companySize: schema.assessmentResults.companySize,
        count: count(),
      })
      .from(schema.assessmentResults)
      .groupBy(schema.assessmentResults.companySize)
      .orderBy(desc(count()));
  }

  async getRecentAssessments(limit: number = 10) {
    return await this.db
      .select({
        id: schema.assessmentResults.id,
        createdAt: schema.assessmentResults.createdAt,
        industry: schema.industries.displayName,
        companySize: schema.assessmentResults.companySize,
        calculatedLevel: schema.assessmentResults.calculatedLevel,
        score: schema.assessmentResults.score,
        email: schema.assessmentResults.email,
      })
      .from(schema.assessmentResults)
      .innerJoin(schema.industries, eq(schema.assessmentResults.industryId, schema.industries.id))
      .orderBy(desc(schema.assessmentResults.createdAt))
      .limit(limit);
  }
}

export class EmailLeadService {
  private db = getDB();

  // Helper: Industry Name zu ID mappen (gleiche Logik wie in AssessmentService)
  private mapIndustryNameToId(industryName: string): string {
    const mapping: Record<string, string> = {
      'Automotive': 'automotive',
      'Banking & Finance': 'banking-finance',
      'Beratung & Consulting': 'consulting',
      'Bildung & Forschung': 'education',
      'Chemie & Pharma': 'chemical-pharma',
      'Einzelhandel': 'retail',
      'Energie & Umwelt': 'energy',
      'Gesundheitswesen': 'healthcare',
      'IT & Software': 'it-software',
      'Logistik & Transport': 'logistics',
      'Maschinenbau': 'manufacturing',
      'Medien & Marketing': 'media',
      'Öffentliche Verwaltung': 'public',
      'Produktion & Fertigung': 'production',
      'Telekommunikation': 'telecom',
      'Tourismus & Gastronomie': 'tourism',
      'Versicherung': 'insurance',
      'Sonstige': 'other',
    };
    return mapping[industryName] || 'other';
  }

  // E-Mail-Lead speichern oder aktualisieren
  async saveOrUpdateLead(
    email: string,
    metadata: {
      assessmentId?: string;
      industryId?: string; // Jetzt direkt industryId verwenden
      companySize?: string;
      calculatedLevel?: string;
      ipAddress?: string;
      userAgent?: string;
      source?: string;
    } = {}
  ) {
    const existingLead = await this.db
      .select()
      .from(schema.emailLeads)
      .where(eq(schema.emailLeads.email, email))
      .limit(1);

    if (existingLead.length > 0) {
      // Update existing lead
      await this.db
        .update(schema.emailLeads)
        .set({
          updatedAt: new Date().toISOString(),
          assessmentId: metadata.assessmentId || existingLead[0].assessmentId,
          industryId: metadata.industryId || existingLead[0].industryId,
          companySize: metadata.companySize || existingLead[0].companySize,
          calculatedLevel: metadata.calculatedLevel || existingLead[0].calculatedLevel,
        })
        .where(eq(schema.emailLeads.email, email));
      
      return existingLead[0].id;
    } else {
      // Create new lead
      const id = uuidv4();
      await this.db.insert(schema.emailLeads).values({
        id,
        email,
        source: metadata.source || 'assessment',
        assessmentId: metadata.assessmentId,
        industryId: metadata.industryId,
        companySize: metadata.companySize,
        calculatedLevel: metadata.calculatedLevel,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });
      
      return id;
    }
  }

  // Lead-Statistiken
  async getLeadStatistics() {
    const totalLeads = await this.db
      .select({ count: count() })
      .from(schema.emailLeads);

    const recentLeads = await this.db
      .select({ count: count() })
      .from(schema.emailLeads)
      .where(gte(schema.emailLeads.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()));

    const bySource = await this.db
      .select({
        source: schema.emailLeads.source,
        count: count(),
      })
      .from(schema.emailLeads)
      .groupBy(schema.emailLeads.source);

    return {
      total: totalLeads[0]?.count || 0,
      recentWeek: recentLeads[0]?.count || 0,
      bySource,
    };
  }

  // Admin-spezifische Methoden
  async getTotalLeads() {
    const result = await this.db
      .select({ count: count() })
      .from(schema.emailLeads);
    return result[0]?.count || 0;
  }

  async getRecentLeads(limit: number = 10) {
    return await this.db
      .select({
        id: schema.emailLeads.id,
        email: schema.emailLeads.email,
        createdAt: schema.emailLeads.createdAt,
        source: schema.emailLeads.source,
        status: schema.emailLeads.status,
        industry: schema.industries.displayName,
        companySize: schema.emailLeads.companySize,
        calculatedLevel: schema.emailLeads.calculatedLevel,
      })
      .from(schema.emailLeads)
      .leftJoin(schema.industries, eq(schema.emailLeads.industryId, schema.industries.id))
      .orderBy(desc(schema.emailLeads.createdAt))
      .limit(limit);
  }
}

export class SessionService {
  private db = getDB();

  // Session erstellen
  async createSession(metadata: {
    ipAddress?: string;
    userAgent?: string;
  } = {}) {
    const id = uuidv4();
    await this.db.insert(schema.assessmentSessions).values({
      id,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
    
    return id;
  }

  // Session aktualisieren
  async updateSession(
    sessionId: string,
    updates: {
      currentStep?: string;
      progress?: number;
      partialData?: any;
      assessmentResultId?: string;
      completedAt?: string;
    }
  ) {
    await this.db
      .update(schema.assessmentSessions)
      .set({
        ...updates,
        lastActivityAt: new Date().toISOString(),
      })
      .where(eq(schema.assessmentSessions.id, sessionId));
  }

  // Session abrufen
  async getSession(sessionId: string) {
    const results = await this.db
      .select()
      .from(schema.assessmentSessions)
      .where(eq(schema.assessmentSessions.id, sessionId))
      .limit(1);
    
    return results[0] || null;
  }
}

export class IndustryService {
  private db = getDB();

  // Alle aktiven Industries abrufen
  async getAllActiveIndustries() {
    return await this.db
      .select()
      .from(schema.industries)
      .where(eq(schema.industries.isActive, true))
      .orderBy(schema.industries.sortOrder, schema.industries.displayName);
  }

  // Industry by ID abrufen
  async getIndustryById(id: string) {
    const results = await this.db
      .select()
      .from(schema.industries)
      .where(eq(schema.industries.id, id))
      .limit(1);
    
    return results[0] || null;
  }

  // Industry by name abrufen
  async getIndustryByName(name: string) {
    const results = await this.db
      .select()
      .from(schema.industries)
      .where(eq(schema.industries.name, name))
      .limit(1);
    
    return results[0] || null;
  }

  // Seed Industries (für Initial Setup)
  async seedIndustries() {
    const industryData = [
      { id: 'automotive', name: 'Automotive', displayName: 'Automotive', sortOrder: 1 },
      { id: 'banking-finance', name: 'Banking & Finance', displayName: 'Banking & Finance', sortOrder: 2 },
      { id: 'consulting', name: 'Beratung & Consulting', displayName: 'Beratung & Consulting', sortOrder: 3 },
      { id: 'education', name: 'Bildung & Forschung', displayName: 'Bildung & Forschung', sortOrder: 4 },
      { id: 'chemical-pharma', name: 'Chemie & Pharma', displayName: 'Chemie & Pharma', sortOrder: 5 },
      { id: 'retail', name: 'Einzelhandel', displayName: 'Einzelhandel', sortOrder: 6 },
      { id: 'energy', name: 'Energie & Umwelt', displayName: 'Energie & Umwelt', sortOrder: 7 },
      { id: 'healthcare', name: 'Gesundheitswesen', displayName: 'Gesundheitswesen', sortOrder: 8 },
      { id: 'it-software', name: 'IT & Software', displayName: 'IT & Software', sortOrder: 9 },
      { id: 'logistics', name: 'Logistik & Transport', displayName: 'Logistik & Transport', sortOrder: 10 },
      { id: 'manufacturing', name: 'Maschinenbau', displayName: 'Maschinenbau', sortOrder: 11 },
      { id: 'media', name: 'Medien & Marketing', displayName: 'Medien & Marketing', sortOrder: 12 },
      { id: 'public', name: 'Öffentliche Verwaltung', displayName: 'Öffentliche Verwaltung', sortOrder: 13 },
      { id: 'production', name: 'Produktion & Fertigung', displayName: 'Produktion & Fertigung', sortOrder: 14 },
      { id: 'telecom', name: 'Telekommunikation', displayName: 'Telekommunikation', sortOrder: 15 },
      { id: 'tourism', name: 'Tourismus & Gastronomie', displayName: 'Tourismus & Gastronomie', sortOrder: 16 },
      { id: 'insurance', name: 'Versicherung', displayName: 'Versicherung', sortOrder: 17 },
      { id: 'other', name: 'Sonstige', displayName: 'Sonstige', sortOrder: 99 },
    ];

    for (const industry of industryData) {
      await this.db
        .insert(schema.industries)
        .values(industry)
        .onConflictDoNothing(); // Ignoriere, falls bereits existiert
    }
  }
}

// Exportiere Service-Instanzen
export const assessmentService = new AssessmentService();
export const emailLeadService = new EmailLeadService();
export const sessionService = new SessionService();
export const industryService = new IndustryService();
