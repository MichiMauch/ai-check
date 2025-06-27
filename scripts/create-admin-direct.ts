import dotenv from 'dotenv';
import path from 'path';

// Lade explizit die .env.local Datei
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getDB } from '../lib/db/client';
import * as schema from '../lib/db/schema';

export async function createAdminUser(username = 'admin', email = 'admin@example.com', password = 'admin123') {
  try {
    console.log('Creating admin user...');
    console.log('Environment check:');
    console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Not set');
    
    const db = getDB();
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      id,
      username,
      email,
      passwordHash,
      role: 'admin',
    };

    await db.insert(schema.users).values(user);
    
    console.log('Admin user created successfully!');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    
    // Passwort-Hash nicht zurückgeben
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Als CLI Script ausführbar
if (process.argv[1].endsWith('create-admin-direct.ts')) {
  const username = process.argv[2] || 'admin';
  const email = process.argv[3] || 'admin@example.com';
  const password = process.argv[4] || 'admin123';
  
  createAdminUser(username, email, password)
    .then(() => {
      console.log('\nYou can now login at /admin/login');
      process.exit(0);
    })
    .catch((error) => {
      if (error.message && error.message.includes('UNIQUE')) {
        console.error('User with this username or email already exists!');
      }
      process.exit(1);
    });
}
