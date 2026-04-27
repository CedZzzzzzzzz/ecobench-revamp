import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email, password, username) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'user',
          admin_created: false
        }
      }
    });

    if (error) {
      if (error.message && error.message.toLowerCase().includes('rate limit')) {
        return {
          data,
          error: {
            ...error,
            message: 'Too many signup attempts for this email. Please wait 15 minutes before trying again.'
          }
        };
      }
      return { data, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Signup error:', err);
    return { data: null, error: err };
  }
};

export const adminCreateUser = async (email, password, username, role = 'user') => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: { email, password, username, role },
    });

    if (error) {
      let message = error.message || 'Edge Function returned a non-2xx status code';

      try {
        const errorBody = await error.context.json();
        message = errorBody?.error || errorBody?.message || message;
      } catch (_) {
      }

      return { data: null, error: { message } };
    }

    if (data?.error) {
      return { data: null, error: { message: data.error } };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Admin create user error:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};



export const adminDeleteUser = async (userId) => {
  try {
    const { data, error } = await supabase.rpc('delete_user_and_auth', { user_id: userId });

    if (error) {
      console.error('Error deleting user via RPC:', error);

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }
    }

    return { error: null };
  } catch (err) {
    console.error('Admin delete user error:', err);
    return { error: err };
  }
};

export const signOut = async () => {
  localStorage.removeItem('ecobench_session');

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resendConfirmationEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Error resending confirmation email:', err);
    return { error: err };
  }
};

export const autoConfirmEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.warn('Could not send confirmation email:', error.message);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Error auto-confirming email:', err);
    return { error: err };
  }
};
