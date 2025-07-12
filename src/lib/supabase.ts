import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Create a mock client if environment variables are not properly set
let supabase;

// Mock admin data for demo purposes
const mockAdmin = {
  id: 'mock-admin-id',
  username: 'admin',
  email: 'admin@techschool.com',
  password_hash: 'admin@123',
  created_at: new Date().toISOString()
};

try {
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://your-project-id.supabase.co' || 
      supabaseAnonKey === 'your-anon-key-here' ||
      supabaseUrl === 'https://placeholder.supabase.co') {
    
    console.warn('Supabase environment variables not configured. Running in demo mode with mock data.');
    
    // Create a mock Supabase client for demo purposes
    supabase = {
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            maybeSingle: () => {
              if (table === 'admins' && column === 'email' && value === 'admin@techschool.com') {
                return Promise.resolve({ data: mockAdmin, error: null });
              }
              return Promise.resolve({ data: null, error: null });
            },
            single: () => {
              if (table === 'admins' && column === 'email' && value === 'admin@techschool.com') {
                return Promise.resolve({ data: mockAdmin, error: null });
              }
              return Promise.resolve({ data: null, error: { message: 'No data found' } });
            }
          }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      })
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client. Running in demo mode.');
  supabase = {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          maybeSingle: () => {
            if (table === 'admins' && column === 'email' && value === 'admin@techschool.com') {
              return Promise.resolve({ data: mockAdmin, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
          single: () => {
            if (table === 'admins' && column === 'email' && value === 'admin@techschool.com') {
              return Promise.resolve({ data: mockAdmin, error: null });
            }
            return Promise.resolve({ data: null, error: { message: 'No data found' } });
          }
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    })
  };
}

export { supabase };