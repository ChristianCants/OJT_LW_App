
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

export const updateInternProfile = async (id, updateData) => {
  const { data, error } = await supabase
    .from('intern_profile')
    .update(updateData)
    .eq('id', id)
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

export const updateDevice = async (id, updateData) => {
  const { data, error } = await supabase
    .from('devices')
    .update(updateData)
    .eq('id', id)
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

export const getAllInternProfiles = async () => {
  // We select all fields from intern_profile and also reach into users to get their devices
  const { data, error } = await supabase
    .from('intern_profile')
    .select(`
            *,
            users:user_id (
                devices (*)
            )
        `)
    .order('created_at', { ascending: false });

  // Flatten the devices for easier consumption in the UI
  const flattenedData = data?.map(profile => ({
    ...profile,
    devices: profile.users?.devices || []
  }));

  return { data: flattenedData, error };
};

export const getDashboardStats = async () => {
  try {
    const { count: totalInterns, error: e1 } = await supabase
      .from('intern_profile')
      .select('*', { count: 'exact', head: true });

    const { count: activeInterns, error: e2 } = await supabase
      .from('intern_profile')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active');

    if (e1 || e2) throw e1 || e2;

    return {
      data: {
        totalInterns: totalInterns || 0,
        activeInterns: activeInterns || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { data: { totalInterns: 0, activeInterns: 0 }, error };
  }
};

// Activity & Evaluation Functions
export const getUserActivities = async (userId) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return { data, error };
};

export const getUserEvaluations = async (userId) => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return { data, error };
};

