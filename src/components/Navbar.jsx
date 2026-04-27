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

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-eco-green to-bench-yellow z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 pt-1">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
              <img src="assets/img/EcoBench%20Logo.png" alt="EcoBench" className="h-10" />
            </Link>

            {/* Right side - Navigation Links and Logout */}
            <div className="flex items-center gap-8">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/home"
                  className={`font-medium transition ${
                    isActive('/home')
                      ? 'text-eco-green border-b-2 border-eco-green pb-1'
                      : 'text-gray-700 hover:text-eco-green'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/faqs"
                  className={`font-medium transition ${
                    isActive('/faqs')
                      ? 'text-eco-green border-b-2 border-eco-green pb-1'
                      : 'text-gray-700 hover:text-eco-green'
                  }`}
                >
                  FAQs
                </Link>
                <Link
                  to="/about"
                  className={`font-medium transition ${
                    isActive('/about')
                      ? 'text-eco-green border-b-2 border-eco-green pb-1'
                      : 'text-gray-700 hover:text-eco-green'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={`font-medium transition ${
                    isActive('/contact')
                      ? 'text-eco-green border-b-2 border-eco-green pb-1'
                      : 'text-gray-700 hover:text-eco-green'
                  }`}
                >
                  Contact
                </Link>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-eco-green text-white rounded-full hover:bg-eco-green-dark transition font-semibold shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu - Simple alternative */}
          <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
            <Link
              to="/home"
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                isActive('/home')
                  ? 'bg-eco-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              to="/faqs"
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                isActive('/faqs')
                  ? 'bg-eco-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              FAQs
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                isActive('/about')
                  ? 'bg-eco-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                isActive('/contact')
                  ? 'bg-eco-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
