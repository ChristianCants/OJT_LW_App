
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ofbrfvjialfcjxgkqdkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYnJmdmppYWxmY2p4Z2txZGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTU3NzIsImV4cCI6MjA4NjM3MTc3Mn0.5fos4jR--MxHVmQtPugM5H7PLKYufJ1udwLGne3fiwA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Custom Auth Functions using user_access table

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select();

  return { data, error };
};

export const customSignIn = async (username, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  return { data, error };
};

// Sign in using email (Gmail) from profile
export const customSignInByEmail = async (email, password) => {
  // This might need deprecated or updated if email is no longer in users table
  // For now I'll comment out logical error or just keep it targeting users but knowing email might be missing
  const { data, error } = await supabase
    .from('users')
    .select('*')
    //.eq('email', email.trim().toLowerCase()) // Email is removed from users table
    .eq('password', password)
    .single();

  return { data, error };
};


// Admin Auth using Supabase Auth
export const adminSignIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  // Sign out from Supabase (for admins)
  const { error } = await supabase.auth.signOut();
  // Also clear custom auth session
  localStorage.removeItem('user');
  return { error };
};

// Intern Profile Functions
export const getInternProfile = async (userId) => {
  const { data, error } = await supabase
    .from('intern_profile')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const saveInternProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('intern_profile')
    .upsert(profileData, { onConflict: 'user_id' })
    .select();
  return { data, error };
};

// Device Functions
export const saveDevice = async (deviceData) => {
  const { data, error } = await supabase
    .from('devices')
    .insert([deviceData])
    .select();
  return { data, error };
};

export const getDevices = async (userId) => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};
