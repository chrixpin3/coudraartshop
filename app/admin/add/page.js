'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaPlus, FaTimes, FaVideo, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AddDrawing() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [mediaFiles, setMediaFiles] = useState([])
  const [formData, setFormData] = useState({ title: '', artist: '', description: '', price: '', category: '', dimensions: '', year: '', medium: '', stock: '', featured: false, image: null })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleMediaAdd = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const isVideo = file.type.startsWith('video/')
        setMediaFiles([...mediaFiles, { id: Date.now(), type: isVideo ? 'video' : 'image', url: event.target.result, title: file.name, isPrimary: mediaFiles.length === 0 }])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const existingDrawings = JSON.parse(localStorage.getItem('drawings') || '[]')
      const newDrawing = {
        id: Date.now(), title: formData.title, artist: formData.artist, description: formData.description,
        price: parseFloat(formData.price), category: formData.category || 'Uncategorized',
        dimensions: formData.dimensions || 'N/A', year: formData.year || 'N/A', medium: formData.medium || 'N/A',
        stock: parseInt(formData.stock) || 0, featured: formData.featured || false,
        image: imagePreview || '🎨',
        media: mediaFiles.map(m => ({ type: m.type, url: m.url, title: m.title, isPrimary: m.isPrimary })),
        rating: 0, reviews: 0, inStock: parseInt(formData.stock) > 0, createdAt: new Date().toISOString()
      }
      localStorage.setItem('drawings', JSON.stringify([newDrawing, ...existingDrawings]))
      toast.success('Drawing added successfully! 🎉')
      router.push('/admin/manage')
    } catch { toast.error('Failed to add drawing') } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mr-4"><FaArrowLeft /></Link>
          <h1 className="text-3xl font-bold">Add New Drawing</h1>
        </div>
        <Link href="/admin/manage" className="text-gray-600 hover:text-gray-800">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter drawing title" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Artist *</label><input type="text" name="artist" required value={formData.artist} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter artist name" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe the artwork..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label><input type="number" name="price" required step="0.01" min="0" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" /></div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select category</option>
                {['Landscape','Portrait','Surrealism','Expressionism','Impressionism','Abstract','Modern','Classical','Religious','Ukiyo-e'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label><input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 72.5 x 92 cm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 1888" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Medium</label><input type="text" name="medium" value={formData.medium} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Oil on canvas" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label><input type="number" name="stock" min="0" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" /></div>
            <div className="flex items-center"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" /><label className="ml-2 text-sm text-gray-700">Featured on Homepage</label></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {imagePreview && <div className="mt-2 relative"><img src={imagePreview} alt="Preview" className="h-32 w-auto rounded-lg object-cover border" /><button type="button" onClick={() => { setImagePreview(null); setFormData({...formData, image: null}) }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><FaTimes /></button></div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Media</label>
              <input type="file" accept="image/*,video/*" onChange={handleMediaAdd} className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              {mediaFiles.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2">{mediaFiles.map(m => <div key={m.id} className="relative group">{m.type === 'video' ? <div className="bg-gray-900 rounded-lg h-20 flex items-center justify-center"><FaVideo className="text-white text-2xl" /></div> : <img src={m.url} alt={m.title} className="h-20 w-full object-cover rounded-lg" />}<button type="button" onClick={() => setMediaFiles(mediaFiles.filter(f => f.id !== m.id))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"><FaTrash className="text-xs" /></button></div>)}</div>}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center disabled:opacity-50">{loading ? 'Adding...' : <><FaPlus className="mr-2" /> Add Drawing</>}</button>
          <button type="button" onClick={() => router.push('/admin')} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold">Cancel</button>
        </div>
      </form>
    </div>
  )
}
