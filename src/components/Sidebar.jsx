import { Link, useLocation } from 'react-router-dom'
import { signOut } from '../lib/supabase'

const Sidebar = () => {
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const isActive = (path) => location.pathname === path

  const getLinkStyle = (path) => {
    const isCurrentPage = isActive(path)
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: isCurrentPage ? 'rgba(255,255,255,0.25)' : 'transparent',
      color: isCurrentPage ? '#ffffff' : 'rgba(255,255,255,0.7)',
      borderRadius: '8px',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontSize: '15px',
      border: isCurrentPage ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid transparent'
    }
  }

  return (
    <aside
      className="hidden lg:block fixed left-0 top-0 h-full w-64 z-40"
      style={{
        background: 'linear-gradient(180deg, #166534 0%, #15803d 100%)',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="assets/img/EcoBench Logo.png"
            alt="EcoBench"
            style={{
              height: '80px',
              margin: '0 auto 16px',
              filter: 'drop-shadow(0 8px 16px rgba(111, 168, 58, 0.4))',
              animation: 'logoFloat 4s ease-in-out infinite'
            }}
          />
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
              margin: 0
            }}
          >
            Sustainable Energy Solutions
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link
            to="/dashboard"
            style={getLinkStyle('/dashboard')}
            onMouseEnter={(e) => {
              if (!isActive('/dashboard')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/dashboard')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.transform = 'translateX(0)'
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>📊</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/users"
            style={getLinkStyle('/users')}
            onMouseEnter={(e) => {
              if (!isActive('/users')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.border = '1px solid rgba(251, 191, 36, 0.4)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/users')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                e.currentTarget.style.border = '1px solid transparent'
                e.currentTarget.style.transform = 'translateX(0)'
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>👥</span>
            <span>User Management</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            color: 'rgba(255,255,255,0.8)',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            fontSize: '15px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
            e.currentTarget.style.color = '#fca5a5'
            e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.6)'
            e.currentTarget.style.transform = 'translateX(4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
            e.currentTarget.style.border = '1px solid transparent'
            e.currentTarget.style.transform = 'translateX(0)'
          }}
        >
          <span style={{ fontSize: '20px' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
