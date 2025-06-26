import { v4 as uuidv4 } from 'uuid';
import { eq, desc, and, gte, count } from 'drizzle-orm';
import { getDB, schema } from './client';
import type { AssessmentResult as AssessmentResultType } from '@/types/assessment';

export class AssessmentService {
  private db = getDB();

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
      industry: result.company_info.industry,
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
        industry: schema.assessmentResults.industry,
        count: count(),
      })
      .from(schema.assessmentResults)
      .groupBy(schema.assessmentResults.industry);

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
}

export class EmailLeadService {
  private db = getDB();

  // E-Mail-Lead speichern oder aktualisieren
  async saveOrUpdateLead(
    email: string,
    metadata: {
      assessmentId?: string;
      industry?: string;
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
          industry: metadata.industry || existingLead[0].industry,
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
        industry: metadata.industry,
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

// Exportiere Service-Instanzen
export const assessmentService = new AssessmentService();
export const emailLeadService = new EmailLeadService();
export const sessionService = new SessionService();
