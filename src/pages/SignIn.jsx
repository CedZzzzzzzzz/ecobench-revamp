import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, resendConfirmationEmail } from '../lib/supabase';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPersistedSession = async () => {
      try {
        const persistedSession = localStorage.getItem('ecobench_session');
        if (!persistedSession) return;

        const sessionData = JSON.parse(persistedSession);
        const { data, error } = await supabase.auth.setSession(sessionData);

        if (error || !data?.user) {
          localStorage.removeItem('ecobench_session');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error loading persisted profile:', profileError);
          localStorage.removeItem('ecobench_session');
          return;
        }

        const destination = profile?.role === 'admin' ? '/dashboard' : '/home';
        navigate(destination);
      } catch (err) {
        console.error('Error restoring session:', err);
        localStorage.removeItem('ecobench_session');
      }
    };

    checkPersistedSession();
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!resendEmail.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resendConfirmationEmail(resendEmail.trim());
      setResendSuccess(true);
      setTimeout(() => {
        setShowResendModal(false);
        setResendSuccess(false);
        setResendEmail('');
      }, 3000);
    } catch (err) {
      console.error('Resend confirmation error:', err);
      setResendSuccess(true);
      setTimeout(() => {
        setShowResendModal(false);
        setResendSuccess(false);
        setResendEmail('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowResendModal(false);

    try {
      const normalizedUsername = username.trim();

      const { data: profile, error: queryError } = await supabase
        .from('profiles')
        .select('email, role, status')
        .eq('username', normalizedUsername)
        .maybeSingle();

      if (queryError) {
        console.error('Profile lookup error:', queryError);
        setError('Unable to sign in right now. Please try again.');
        setLoading(false);
        return;
      }

      if (!profile) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }

      if (profile.status !== 'active') {
        setError('Your account has been deactivated. Please contact support.');
        setLoading(false);
        return;
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (signInError) {
        const message = signInError.message?.toLowerCase() || '';

        if (message.includes('email not confirmed')) {
          setShowResendModal(true);
          setResendEmail('');
          setError('Your email is not verified yet. Please check your inbox or click below to resend verification.');
          setLoading(false);
          return;
        }

        if (message.includes('invalid') || message.includes('credentials')) {
          setError('Invalid username or password.');
          setLoading(false);
          return;
        }

        setError('Unable to sign in. Please try again.');
        setLoading(false);
        return;
      }

      if (signInData?.user && !signInData.user.email_confirmed_at) {
        await supabase.auth.signOut();
        setShowResendModal(true);
        setResendEmail('');
        setError('Your email is not verified yet. Please check your inbox or click below to resend verification.');
        setLoading(false);
        return;
      }

      if (rememberMe && signInData?.session) {
        localStorage.setItem('ecobench_session', JSON.stringify(signInData.session));
      } else {
        localStorage.removeItem('ecobench_session');
      }

      const destination = profile.role === 'admin' ? '/dashboard' : '/home';
      setLoading(false);
      navigate(destination);
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Unable to sign in right now. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(315deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.5) 15%, rgba(250, 245, 220, 0.3) 50%, rgba(132, 173, 57, 0.08) 85%, rgba(255, 255, 255, 0.9) 100%)'
      }}
    >
      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.4; }
            90% { opacity: 0.4; }
            100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
          }
          @keyframes buttonWaterFill {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.95) translateY(-10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .bubble { position: absolute; background-color: #86AD39; border-radius: 50%; pointer-events: none; }
          .bubble1 { width: 12px; height: 12px; left: 10%; bottom: -50px; animation: floatUp 8s infinite; }
          .bubble2 { width: 8px; height: 8px; left: 20%; bottom: -30px; animation: floatUp 10s infinite; animation-delay: 2s; }
          .bubble3 { width: 10px; height: 10px; left: 30%; bottom: -40px; animation: floatUp 9s infinite; animation-delay: 4s; }
          .bubble4 { width: 7px; height: 7px; left: 40%; bottom: -20px; animation: floatUp 11s infinite; animation-delay: 1s; }
          .bubble5 { width: 14px; height: 14px; left: 50%; bottom: -60px; animation: floatUp 8.5s infinite; animation-delay: 3s; }
          .bubble6 { width: 9px; height: 9px; left: 60%; bottom: -35px; animation: floatUp 10s infinite; animation-delay: 5s; }
          .bubble7 { width: 11px; height: 11px; left: 70%; bottom: -45px; animation: floatUp 9s infinite; animation-delay: 2.5s; }
          .bubble8 { width: 13px; height: 13px; left: 80%; bottom: -55px; animation: floatUp 11s infinite; animation-delay: 4s; }
          .bubble9 { width: 8px; height: 8px; left: 90%; bottom: -25px; animation: floatUp 8.5s infinite; animation-delay: 1.5s; }
          .modal-overlay { animation: fadeIn 0.3s ease-out; }
          .modal-content { animation: modalSlideIn 0.3s ease-out; }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div className="bubble bubble1"></div>
        <div className="bubble bubble2"></div>
        <div className="bubble bubble3"></div>
        <div className="bubble bubble4"></div>
        <div className="bubble bubble5"></div>
        <div className="bubble bubble6"></div>
        <div className="bubble bubble7"></div>
        <div className="bubble bubble8"></div>
        <div className="bubble bubble9"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-4 w-full flex justify-center">
          <img src="/assets/img/EcoBench%20Logo.png" alt="EcoBench" className="h-32" />
        </div>

        <div className="w-full">
          <div
            className="rounded-[2.5rem] shadow-2xl overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 200, 100, 0.15) 40%, rgba(255, 255, 255, 0.8) 100%)'
            }}
          >
            <div className="h-1.5" style={{ background: 'linear-gradient(to right, #f4c430, #86AD39)' }}></div>

            <div className="p-12 w-full">
              <h2 className="text-3xl font-semibold mb-6 px-6" style={{ color: '#86AD39' }}>
                Sign In
              </h2>

              {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-3 m-0 px-6 py-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1 tracking-wide">
                    USERNAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-2 bg-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder-gray-400 transition-colors text-sm"
                      style={{ backgroundColor: '#f9f9f9' }}
                      onFocus={(e) => (e.target.style.backgroundColor = '#ffffff')}
                      onBlur={(e) => (e.target.style.backgroundColor = '#f9f9f9')}
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1 tracking-wide">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full pl-4 pr-4 py-2 bg-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder-gray-400 transition-colors text-sm"
                      style={{ backgroundColor: '#f9f9f9' }}
                      onFocus={(e) => (e.target.style.backgroundColor = '#ffffff')}
                      onBlur={(e) => (e.target.style.backgroundColor = '#f9f9f9')}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer border-2 border-gray-300"
                      style={{ accentColor: '#86AD39' }}
                    />
                    <span className="text-gray-600 font-medium text-sm">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white rounded-full font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-3 shadow-lg"
                  style={{ backgroundColor: '#86AD39' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundImage =
                      'linear-gradient(90deg, #76943a 0%, rgba(255, 255, 255, 0.4) 50%, #76943a 100%)';
                    e.target.style.backgroundSize = '200% 100%';
                    e.target.style.backgroundPosition = '0% 50%';
                    e.target.style.animation = 'buttonWaterFill 1.8s ease-in-out infinite';
                    e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundImage = 'none';
                    e.target.style.animation = 'none';
                    e.target.style.backgroundColor = '#86AD39';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {loading ? 'Signing In...' : 'SIGN IN'}
                </button>
              </form>

              <div className="mt-3 text-center">
                <p className="text-gray-600 text-sm">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="font-bold hover:opacity-80 transition" style={{ color: '#86AD39' }}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resend Email Modal */}
      {showResendModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="h-1.5" style={{ background: 'linear-gradient(to right, #f4c430, #86AD39)' }}></div>
            
            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: 'rgba(134, 173, 57, 0.1)' }}>
                  ✉️
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-2" style={{ color: '#86AD39' }}>
                Email Verification Required
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm mb-6">
                We need to verify your email address. Enter your email below to receive a new confirmation link.
              </p>

              {/* Success Message */}
              {resendSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium text-center">
                  ✅ Verification email sent! Please check your inbox.
                </div>
              )}

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                  style={{ borderColor: '#e2e8f0', backgroundColor: '#f9f9f9' }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.borderColor = '#86AD39';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#f9f9f9';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResendModal(false);
                    setResendEmail('');
                    setResendSuccess(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm transition-all hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={loading || !resendEmail.trim()}
                  className="flex-1 px-4 py-3 text-white rounded-full font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ backgroundColor: '#86AD39' }}
                  onMouseEnter={(e) => {
                    if (!loading && resendEmail.trim()) {
                      e.target.style.backgroundColor = '#76943a';
                      e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#86AD39';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {loading ? 'Sending...' : 'Send Verification Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;