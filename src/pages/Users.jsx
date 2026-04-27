import { useState, useEffect } from 'react'
import '../styles/dashboard.css'
import Sidebar from '../components/Sidebar'
import { supabase, adminCreateUser, adminDeleteUser } from '../lib/supabase'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  })
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, username: '' })
  const [editModal, setEditModal] = useState({ show: false, userId: null, username: '', email: '' })
  const [editFormData, setEditFormData] = useState({ newPassword: '', confirmPassword: '' })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { data, error } = await adminCreateUser(
        formData.email,
        formData.password,
        formData.username,
        formData.role
      )

      if (error) throw error

      setFormData({ username: '', email: '', password: '', role: 'user' })
      setShowForm(false)
      setSuccessMessage('User created successfully! Email is automatically verified.')
      setTimeout(() => setSuccessMessage(''), 3000)
      await fetchUsers()
    } catch (err) {
      console.error('Error adding user:', err)
      setErrorMessage(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      const { error } = await adminDeleteUser(userId)
      
      if (error) throw error
      
      setSuccessMessage('User deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      setDeleteModal({ show: false, userId: null, username: '' })
      
      await fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      setErrorMessage(`Error: ${err.message}`)
      await fetchUsers()
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId)

      if (error) throw error
      await fetchUsers()
    } catch (err) {
      console.error('Error updating user status:', err)
      setErrorMessage(`Error: ${err.message}`)
    }
  }

  const handleEditClick = (user) => {
    setEditModal({ show: true, userId: user.id, username: user.username, email: user.email })
    setEditFormData({ newPassword: '', confirmPassword: '' })
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (editFormData.newPassword !== editFormData.confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    if (editFormData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      return
    }

    setIsUpdatingPassword(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Call Supabase edge function to update password
      const { data, error } = await supabase.functions.invoke('admin-update-password', {
        body: { userId: editModal.userId, newPassword: editFormData.newPassword }
      })

      if (error) throw error

      setSuccessMessage('Password updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      setEditModal({ show: false, userId: null, username: '', email: '' })
      setEditFormData({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error('Error updating password:', err)
      setErrorMessage(`Error: ${err.message || 'Failed to update password'}`)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfccb 50%, #fef9c3 100%)' }}>
      <Sidebar />

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', marginLeft: '256px', padding: '2rem' }}>
        {/* Header */}
        <div className="header-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>User Management</h1>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>View and manage registered users</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                padding: '0.5rem 1.25rem',
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                border: '1px solid #22c55e',
                borderRadius: '50px',
                fontWeight: 700,
                color: '#065f46',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                👥 {users.length} Users
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                  color: 'white',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                👤+ {showForm ? 'Cancel' : 'Add New User'}
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <span>✓</span>
            <span>{successMessage}</span>
            <button className="alert-close" onClick={() => setSuccessMessage('')}>×</button>
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>!</span>
            <span>{errorMessage}</span>
            <button className="alert-close" onClick={() => setErrorMessage('')}>×</button>
          </div>
        )}

        {/* Add User Form */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '2rem', border: '2px solid #e5e7eb' }}>
            <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)', borderBottom: '2px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', fontFamily: "'Space Grotesk', sans-serif" }}>Create New User</h2>
            </div>
            <form onSubmit={handleAddUser} style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                    Username
                  </label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="form-group input" required />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                    Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-group input" required />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                    Password
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-group input" required />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                    Role
                  </label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="form-group input">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: isSubmitting ? '#ccc' : 'linear-gradient(135deg, #16a34a, #22c55e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="table-container">
          <div className="table-header" style={{
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px 12px 0 0',
            marginBottom: '0'
          }}>
            <div className="table-title" style={{
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: '0'
            }}>
              Registered Users
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="empty-state" style={{ color: '#dc2626' }}>
              <p>❌ Error loading users: {error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>📭 No users found. Create one to get started!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>👤</span>
                          {user.username}
                        </strong>
                      </td>
                      <td>
                        {user.email}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.375rem 0.75rem',
                          background: user.role === 'admin' ? 'linear-gradient(135deg, #ddd6fe, #c4b5fd)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                          color: user.role === 'admin' ? '#5b21b6' : '#1e40af',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          borderRadius: '50px',
                          border: `1px solid ${user.role === 'admin' ? '#8b5cf6' : '#3b82f6'}`
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: user.status === 'active' ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                            color: user.status === 'active' ? '#065f46' : '#991b1b',
                            border: `1px solid ${user.status === 'active' ? '#22c55e' : '#ef4444'}`,
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            cursor: 'pointer'
                          }}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons" style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="btn-edit"
                            title="Edit user password"
                            style={{
                              width: 'fit-content',
                              padding: '0.4rem 0.8rem',
                              background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)',
                              color: '#1e40af',
                              border: '1px solid #3b82f6',
                              borderRadius: '8px',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #93c5fd, #60a5fa)'
                              e.target.style.transform = 'translateY(-2px)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #bfdbfe, #93c5fd)'
                              e.target.style.transform = 'translateY(0)'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, userId: user.id, username: user.username })}
                            className="btn-delete"
                            title="Delete user"
                            style={{
                              width: 'fit-content',
                              padding: '0.4rem 0.8rem',
                              background: 'linear-gradient(135deg, #fecaca, #fca5a5)',
                              color: '#991b1b',
                              border: '1px solid #ef4444',
                              borderRadius: '8px',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #fca5a5, #f87171)'
                              e.target.style.transform = 'translateY(-2px)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #fecaca, #fca5a5)'
                              e.target.style.transform = 'translateY(0)'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="modal active">
            <div className="modal-content modal-danger">
              <div className="modal-header">
                <h3>
                  <span style={{ color: '#ef4444' }}>⚠️</span>
                  Delete User
                </h3>
                <button className="modal-close" onClick={() => setDeleteModal({ show: false, userId: null, username: '' })}>×</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{deleteModal.username}</strong>?</p>
                <p className="text-warning">⚠️ This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setDeleteModal({ show: false, userId: null, username: '' })}>Cancel</button>
                <button className="btn-delete-confirm" onClick={() => handleDeleteUser(deleteModal.userId)}>Delete User</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Password Modal */}
        {editModal.show && (
          <div className="modal active" style={{ zIndex: 1000 }}>
            <div className="modal-content" style={{
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(22, 163, 74, 0.25)',
              background: 'white',
              border: 'none',
              maxWidth: '576px',
              width: '100%'
            }}>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                borderBottom: 'none',
                padding: '1.25rem',
                borderRadius: '16px 16px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: '0' }}>
                  Change Password
                </h3>
                <button className="modal-close" onClick={() => {
                  setEditModal({ show: false, userId: null, username: '', email: '' })
                  setEditFormData({ newPassword: '', confirmPassword: '' })
                }} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>×</button>
              </div>

              <div className="modal-body" style={{ padding: '1.5rem' }}>
                {/* User Info - Read Only */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
                    <div style={{
                      padding: '0.6rem',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#166534',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {editModal.username}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                    <div style={{
                      padding: '0.6rem',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#166534',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {editModal.email}
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <form onSubmit={handlePasswordChange}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{
                      fontWeight: 700,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      fontSize: '0.8rem',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={editFormData.newPassword}
                      onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid #d1e5d9',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16a34a'
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)'
                        e.target.style.outline = 'none'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1e5d9'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      fontWeight: 700,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      fontSize: '0.8rem',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={editFormData.confirmPassword}
                      onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid #d1e5d9',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16a34a'
                        e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)'
                        e.target.style.outline = 'none'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1e5d9'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  <div style={{
                    padding: '0.75rem',
                    background: '#f0fdf4',
                    border: '1px solid #d1e5d9',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.75rem',
                    color: '#374151'
                  }}>
                    <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password Requirements:</span>
                    <ul style={{ margin: '0.5rem 0 0 1.25rem', paddingLeft: '0' }}>
                      <li>At least 6 characters</li>
                      <li>Must match confirmation</li>
                    </ul>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditModal({ show: false, userId: null, username: '', email: '' })
                        setEditFormData({ newPassword: '', confirmPassword: '' })
                      }}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: '#e5e7eb',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#d1d5db'
                        e.target.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#e5e7eb'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: isUpdatingPassword ? '#ccc' : 'linear-gradient(135deg, #16a34a, #22c55e)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: isUpdatingPassword ? 'not-allowed' : 'pointer',
                        opacity: isUpdatingPassword ? 0.6 : 1,
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!isUpdatingPassword) {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 8px 16px rgba(22, 163, 74, 0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Users
