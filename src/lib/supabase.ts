import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Create a mock client if environment variables are not properly set
let supabase;

try {
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://your-project-id.supabase.co' || 
      supabaseAnonKey === 'your-anon-key-here' ||
      supabaseUrl === 'https://placeholder.supabase.co') {
    
    console.warn('Supabase environment variables not configured. Running in demo mode with mock data.');
    
    // Create a mock Supabase client for demo purposes
    supabase = {
      from: (table: string) => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no backend connection' } }),
          maybeSingle: () => Promise.resolve({ data: null, error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no backend connection' } })
      })
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client. Running in demo mode.');
  supabase = {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no backend connection' } }),
        maybeSingle: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no backend connection' } })
    })
  };
}

export { supabase };