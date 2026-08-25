'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent!')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Your Name" required className="w-full px-4 py-2 border rounded" onChange={handleChange} value={formData.name} />
          <input type="email" name="email" placeholder="Your Email" required className="w-full px-4 py-2 border rounded" onChange={handleChange} value={formData.email} />
          <textarea name="message" placeholder="Your Message" rows="4" required className="w-full px-4 py-2 border rounded" onChange={handleChange} value={formData.message}></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Send Message</button>
        </form>
      </div>
    </div>
  )
}
