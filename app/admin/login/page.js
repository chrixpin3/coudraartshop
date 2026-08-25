'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-jwt-token')
      localStorage.setItem('admin', JSON.stringify({ id: 1, username: 'admin', is_admin: true }))
      toast.success('Welcome Admin!')
      router.push('/admin')
    } else {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem' }}>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} placeholder="Admin username" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} placeholder="Admin password" />
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Login</button>
        </form>
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>Welcome Admin</p>
        </div>
      </div>
    </div>
  )
}
