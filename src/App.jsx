import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Analytics } from '@vercel/analytics/react'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQs from './pages/FAQs'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'

// Admin-only protected route
const AdminRoute = ({ children }) => {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setSession(null)
          setLoading(false)
          return
        }

        // Get user role from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setSession(session)
        setUserRole(profile?.role)
        setLoading(false)
      } catch (error) {
        console.error('Error checking admin access:', error)
        setLoading(false)
      }
    }

    checkAdminAccess()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkAdminAccess()
      } else {
        setSession(null)
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-eco-green"></div>
      </div>
    )
  }

  if (!session || userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/dashboard" 
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App