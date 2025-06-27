import dotenv from 'dotenv';
import path from 'path';

// Lade explizit die .env.local Datei
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { authService } from '../lib/auth/auth-service';

export async function createAdminUser(username = 'admin', email = 'admin@example.com', password = 'admin123') {
  try {
    console.log('Creating admin user...');
    
    const user = await authService.createUser({
      username,
      email,
      password,
      role: 'admin'
    });
    
    console.log('Admin user created successfully!');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Als CLI Script ausführbar
if (process.argv[1].endsWith('create-admin.ts')) {
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
