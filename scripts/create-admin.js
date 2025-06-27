#!/usr/bin/env node

import { authService } from '../lib/auth/auth-service.js';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@example.com';
    const password = process.argv[4] || 'admin123';
    
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
    console.log('\nYou can now login at /admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    if (error.message && error.message.includes('UNIQUE')) {
      console.error('User with this username or email already exists!');
    }
    
    process.exit(1);
  }
}

createAdminUser();
