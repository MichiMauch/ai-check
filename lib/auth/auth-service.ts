import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { eq, and, lt, gt } from 'drizzle-orm';
import { getDB } from '../db/client';
import * as schema from '../db/schema';

export class AuthService {
  private db = getDB();

  // User erstellen
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(userData.password, 12);

    const user = {
      id,
      username: userData.username,
      email: userData.email,
      passwordHash,
      role: userData.role || 'admin',
    };

    await this.db.insert(schema.users).values(user);
    
    // Passwort-Hash nicht zurückgeben
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Login
  async login(username: string, password: string, metadata?: {
    ipAddress?: string;
    userAgent?: string;
  }) {
    // User finden
    const users = await this.db
      .select()
      .from(schema.users)
      .where(and(
        eq(schema.users.username, username),
        eq(schema.users.isActive, true)
      ))
      .limit(1);

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];

    // Passwort prüfen
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Session erstellen
    const sessionId = uuidv4();
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

    await this.db.insert(schema.authSessions).values({
      id: sessionId,
      userId: user.id,
      sessionToken,
      expiresAt,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    });

    // Last login aktualisieren
    await this.db
      .update(schema.users)
      .set({ 
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.users.id, user.id));

    // User ohne Passwort zurückgeben
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      sessionToken,
      expiresAt,
    };
  }

  // Session validieren
  async validateSession(sessionToken: string) {
    const sessions = await this.db
      .select({
        session: schema.authSessions,
        user: {
          id: schema.users.id,
          username: schema.users.username,
          email: schema.users.email,
          role: schema.users.role,
          isActive: schema.users.isActive,
        }
      })
      .from(schema.authSessions)
      .innerJoin(schema.users, eq(schema.authSessions.userId, schema.users.id))
      .where(and(
        eq(schema.authSessions.sessionToken, sessionToken),
        gt(schema.authSessions.expiresAt, new Date().toISOString()),
        eq(schema.users.isActive, true)
      ))
      .limit(1);

    if (sessions.length === 0) {
      return null;
    }

    return sessions[0];
  }

  // Logout
  async logout(sessionToken: string) {
    await this.db
      .delete(schema.authSessions)
      .where(eq(schema.authSessions.sessionToken, sessionToken));
  }

  // Session verlängern
  async extendSession(sessionToken: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    await this.db
      .update(schema.authSessions)
      .set({ expiresAt })
      .where(eq(schema.authSessions.sessionToken, sessionToken));
  }

  // Abgelaufene Sessions löschen
  async cleanupExpiredSessions() {
    await this.db
      .delete(schema.authSessions)
      .where(lt(schema.authSessions.expiresAt, new Date().toISOString()));
  }

  // Alle Sessions eines Users löschen
  async logoutAllSessions(userId: string) {
    await this.db
      .delete(schema.authSessions)
      .where(eq(schema.authSessions.userId, userId));
  }
}

export const authService = new AuthService();
