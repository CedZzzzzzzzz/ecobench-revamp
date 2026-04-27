import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabase'

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    const { username, email, password, confirmPassword } = formData

    // Validation
    if (!username) {
      setErrors(['Username is required.'])
      setLoading(false)
      return
    }
    if (!email) {
      setErrors(['Email is required.'])
      setLoading(false)
      return
    }
    if (!password) {
      setErrors(['Password is required.'])
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match.'])
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setErrors(['Password must be at least 6 characters.'])
      setLoading(false)
      return
    }

    const { data, error } = await signUp(email, password, username)

    if (error) {
      let message = 'Something went wrong. Please try again.'

      // Handle duplicate email safely
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists')
      ) {
        message = 'This email cannot be used. Please try signing in with another email.'
      }

      setErrors([message])
      setLoading(false)
      return
    }

    alert('Account created successfully! Please check your email to verify your account.')
    navigate('/signin')
  }

  return (
    <div className="h-screen flex items-center justify-center p-8 relative overflow-hidden" style={{
      background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.5) 15%, rgba(250, 245, 220, 0.3) 50%, rgba(132, 173, 57, 0.08) 85%, rgba(255, 255, 255, 0.9) 100%)'
    }}>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="w-full max-w-md relative z-10 flex flex-col items-center max-h-screen overflow-y-auto hide-scrollbar">
        {/* Logo */}
        <div className="text-center mb-5 w-full flex justify-center">
          <img 
            src="/assets/img/EcoBench%20Logo.png" 
            alt="EcoBench" 
            className="h-28"
          />
        </div>

        {/* Gradient Line + Card Container */}
        <div className="w-full">
          {/* Sign Up Card with integrated gradient line */}
          <div className="rounded-3xl shadow-2xl overflow-hidden" style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 200, 100, 0.15) 40%, rgba(255, 255, 255, 0.8) 100%)'
          }}>
            {/* Gradient Line - Coating on top */}
            <div className="h-1.5" style={{ background: 'linear-gradient(to right, #f4c430, #86AD39)' }}></div>
            
            {/* Form Content */}
            <div className="p-8">
              <style>{`
                @keyframes buttonWaterFill {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
            
            <h2 className="text-4xl font-semibold mb-6" style={{ color: '#86AD39' }}>Sign Up</h2>

            {errors.length > 0 && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                <ul className="list-disc list-inside">
                  {errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                  USERNAME
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 text-lg">
                    👤
                  </span>
                  <input
                    type="text"
                    name="username"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 placeholder-gray-400 transition-colors text-sm"
                    style={{ borderColor: '#e2e8f0' }}
                    onFocus={(e) => e.target.style.borderColor = '#e2e8f0'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                  EMAIL
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 text-lg">
                    ✉️
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 placeholder-gray-400 transition-colors text-sm"
                    style={{ borderColor: '#e2e8f0' }}
                    onFocus={(e) => e.target.style.borderColor = '#e2e8f0'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                  PASSWORD
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 text-lg">
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 placeholder-gray-400 transition-colors text-sm"
                    style={{ borderColor: '#e2e8f0' }}
                    onFocus={(e) => e.target.style.borderColor = '#e2e8f0'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 tracking-wide">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 text-lg">
                    ✓
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 placeholder-gray-400 transition-colors text-sm"
                    style={{ borderColor: '#e2e8f0' }}
                    onFocus={(e) => e.target.style.borderColor = '#e2e8f0'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-white rounded-full font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg"
                style={{ backgroundColor: '#86AD39' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundImage = 'linear-gradient(90deg, #76943a 0%, rgba(255, 255, 255, 0.4) 50%, #76943a 100%)';
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
                {loading ? 'Creating Account...' : 'SIGN UP'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/signin" className="font-bold hover:opacity-80 transition" style={{ color: '#86AD39' }}>
                  Sign In
                </Link>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp