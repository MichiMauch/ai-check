import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

// Tabelle für Assessment-Ergebnisse
export const assessmentResults = sqliteTable('assessment_results', {
  id: text('id').primaryKey(), // UUID
  
  // Zeitstempel
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Unternehmensinformationen
  industry: text('industry').notNull(),
  companySize: text('company_size').notNull(),
  
  // Assessment-Daten
  selfAssessment: text('self_assessment').notNull(),
  calculatedLevel: text('calculated_level').notNull(),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull().default(75),
  
  // Erweiterte Daten (JSON)
  answers: text('answers', { mode: 'json' }).notNull(), // Array der Antworten
  insight: text('insight'),
  delta: text('delta'),
  nextSteps: text('next_steps'),
  
  // Empfehlungen
  aiRecommendation: text('ai_recommendation'),
  recommendedProducts: text('recommended_products', { mode: 'json' }), // Array der Produkt-IDs
  
  // User-Daten (optional)
  email: text('email'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  
  // Analytik
  completionTimeMs: integer('completion_time_ms'), // Zeit für das gesamte Assessment
  source: text('source').default('web'), // web, api, etc.
}, (table) => ({
  // Indizes für bessere Performance
  industryIdx: index('idx_industry').on(table.industry),
  companySizeIdx: index('idx_company_size').on(table.companySize),
  calculatedLevelIdx: index('idx_calculated_level').on(table.calculatedLevel),
  emailIdx: index('idx_email').on(table.email),
  createdAtIdx: index('idx_created_at').on(table.createdAt),
}));

// Tabelle für E-Mail-Leads (separate Tabelle für bessere Analytik)
export const emailLeads = sqliteTable('email_leads', {
  id: text('id').primaryKey(), // UUID
  email: text('email').notNull().unique(),
  
  // Zeitstempel
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Lead-Daten
  source: text('source').notNull().default('assessment'), // assessment, newsletter, etc.
  status: text('status').notNull().default('active'), // active, unsubscribed, bounced
  
  // Verknüpfung zum Assessment (optional)
  assessmentId: text('assessment_id').references(() => assessmentResults.id),
  
  // Zusätzliche Daten
  industry: text('industry'),
  companySize: text('company_size'),
  calculatedLevel: text('calculated_level'),
  
  // Meta-Daten
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  
  // Kommunikation
  emailsSent: integer('emails_sent').notNull().default(0),
  lastEmailSent: text('last_email_sent'),
  
}, (table) => ({
  emailIdx: index('idx_email_leads_email').on(table.email),
  sourceIdx: index('idx_email_leads_source').on(table.source),
  createdAtIdx: index('idx_email_leads_created_at').on(table.createdAt),
  statusIdx: index('idx_email_leads_status').on(table.status),
}));

// Tabelle für Session-Tracking (optional, für Analytik)
export const assessmentSessions = sqliteTable('assessment_sessions', {
  id: text('id').primaryKey(), // UUID
  
  // Zeitstempel
  startedAt: text('started_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text('completed_at'),
  lastActivityAt: text('last_activity_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Session-Daten
  currentStep: text('current_step').notNull().default('company-info'), // company-info, self-assessment, questions, results
  progress: real('progress').notNull().default(0), // 0-100%
  
  // Teilweise Daten (für Resume-Funktionalität)
  partialData: text('partial_data', { mode: 'json' }),
  
  // Verknüpfung zum finalen Result
  assessmentResultId: text('assessment_result_id').references(() => assessmentResults.id),
  
  // Meta-Daten
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  
}, (table) => ({
  startedAtIdx: index('idx_sessions_started_at').on(table.startedAt),
  currentStepIdx: index('idx_sessions_current_step').on(table.currentStep),
  completedAtIdx: index('idx_sessions_completed_at').on(table.completedAt),
}));

// Type-Inferenz für TypeScript
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type NewAssessmentResult = typeof assessmentResults.$inferInsert;

export type EmailLead = typeof emailLeads.$inferSelect;
export type NewEmailLead = typeof emailLeads.$inferInsert;

export type AssessmentSession = typeof assessmentSessions.$inferSelect;
export type NewAssessmentSession = typeof assessmentSessions.$inferInsert;
