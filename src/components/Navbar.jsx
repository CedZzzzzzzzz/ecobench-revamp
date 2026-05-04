import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOut } from '../lib/supabase'

const Navbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    {
      to: '/home',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      to: '/faqs',
      label: 'FAQs',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      ),
    },
    {
      to: '/about',
      label: 'About',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      to: '/contact',
      label: 'Contact',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-eco-green to-bench-yellow z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 pt-1">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
              <img src="assets/img/EcoBench%20Logo.png" alt="EcoBench" className="h-10" />
            </Link>

            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`font-medium transition ${
                      isActive(to)
                        ? 'text-eco-green border-b-2 border-eco-green pb-1'
                        : 'text-gray-700 hover:text-eco-green'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:block px-6 py-2 bg-eco-green text-white rounded-full hover:bg-eco-green-dark transition font-semibold shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-navbar-wrapper" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Frosted glass backdrop */}
        <div className="mobile-navbar-container"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(229, 231, 235, 0.8)',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.08)',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div className="mobile-navbar-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 4px 6px', gap: '0px', width: '100%' }}>
            {navLinks.map(({ to, label, icon }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`mobile-nav-item ${active ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0px',
                    padding: '8px 8px',
                    borderRadius: '6px',
                    background: active ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                    color: active ? '#16a34a' : '#9ca3af',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    flex: 1,
                    minWidth: 0,
                    maxWidth: '100%',
                  }}
                  title={label}
                >
                  {/* Active dot indicator */}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '1px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '2px',
                        borderRadius: '50%',
                        background: '#16a34a',
                      }}
                    />
                  )}
                  <span className="mobile-nav-icon"
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: active ? 'translateY(0.5px) scale(1.05)' : 'translateY(0) scale(1)',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </span>
                  <span className="mobile-nav-label"
                    style={{
                      fontSize: '11px',
                      fontWeight: active ? 700 : 500,
                      letterSpacing: '0em',
                      fontFamily: "'Poppins', sans-serif",
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                      lineHeight: '1.1',
                      marginTop: '3px',
                    }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="mobile-nav-item logout-btn"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0px',
                padding: '8px 8px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                minWidth: 0,
                maxWidth: '100%',
                fontFamily: "'Poppins', sans-serif",
              }}
              title="Logout"
              onTouchStart={e => {
                e.currentTarget.style.color = '#ef4444'
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
              }}
              onTouchEnd={e => {
                e.currentTarget.style.color = '#9ca3af'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="36" height="36" className="mobile-nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="mobile-nav-label" style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.1', marginTop: '3px' }}>Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding spacer so content isn't hidden behind mobile nav */}
      <div className="md:hidden mobile-nav-spacer" style={{ height: '100px' }} />
    </>
  )
}

export default Navbar