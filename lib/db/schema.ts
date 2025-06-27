import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Tabelle für Assessment-Ergebnisse
export const assessmentResults = sqliteTable('assessment_results', {
  id: text('id').primaryKey(), // UUID
  
  // Zeitstempel
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  
  // Unternehmensinformationen
  industryId: text('industry_id').notNull().references(() => industries.id),
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
  industryIdIdx: index('idx_industry_id').on(table.industryId),
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
  industryId: text('industry_id').references(() => industries.id),
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

// Industries Tabelle
export const industries = sqliteTable('industries', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  aiApplications: text('ai_applications'), // JSON string mit typischen AI-Anwendungen
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
}, (table) => ({
  nameIdx: index('idx_industries_name').on(table.name),
  activeIdx: index('idx_industries_active').on(table.isActive),
  sortIdx: index('idx_industries_sort').on(table.sortOrder),
}));

// Users Tabelle für Admin-Authentifizierung
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'), // admin, superadmin
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP').notNull(),
}, (table) => ({
  usernameIdx: index('idx_users_username').on(table.username),
  emailIdx: index('idx_users_email').on(table.email),
  roleIdx: index('idx_users_role').on(table.role),
  activeIdx: index('idx_users_active').on(table.isActive),
}));

// Sessions Tabelle für Auth-Sessions
export const authSessions = sqliteTable('auth_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
}, (table) => ({
  userIdIdx: index('idx_auth_sessions_user_id').on(table.userId),
  sessionTokenIdx: index('idx_auth_sessions_token').on(table.sessionToken),
  expiresAtIdx: index('idx_auth_sessions_expires').on(table.expiresAt),
}));

// Type-Inferenz für TypeScript
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type NewAssessmentResult = typeof assessmentResults.$inferInsert;

export type EmailLead = typeof emailLeads.$inferSelect;
export type NewEmailLead = typeof emailLeads.$inferInsert;

export type AssessmentSession = typeof assessmentSessions.$inferSelect;
export type NewAssessmentSession = typeof assessmentSessions.$inferInsert;

export type Industry = typeof industries.$inferSelect;
export type NewIndustry = typeof industries.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type AuthSession = typeof authSessions.$inferSelect;
export type NewAuthSession = typeof authSessions.$inferInsert;
