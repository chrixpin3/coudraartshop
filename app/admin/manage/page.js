'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaEdit, FaTrash, FaPlus, FaSearch, FaImage, FaVideo, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function ManageDrawings() {
  const [drawings, setDrawings] = useState([])
  const [filteredDrawings, setFilteredDrawings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('drawings')
    if (saved) { const p = JSON.parse(saved); setDrawings(p); setFilteredDrawings(p) }
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = drawings
    if (searchTerm) filtered = filtered.filter(d => d.title?.toLowerCase().includes(searchTerm.toLowerCase()) || d.artist?.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedCategory !== 'all') filtered = filtered.filter(d => d.category === selectedCategory)
    setFilteredDrawings(filtered)
  }, [searchTerm, selectedCategory, drawings])

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = drawings.filter(d => d.id !== id)
      setDrawings(updated); localStorage.setItem('drawings', JSON.stringify(updated)); toast.success(`Deleted "${title}"`)
    }
  }

  const toggleFeatured = (id) => {
    const updated = drawings.map(d => d.id === id ? { ...d, featured: !d.featured } : d)
    setDrawings(updated); localStorage.setItem('drawings', JSON.stringify(updated)); toast.success('Featured status updated')
  }

  const categories = ['all', ...new Set(drawings.map(d => d.category).filter(Boolean))]

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div></div></div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div><h1 className="text-3xl font-bold">Manage Drawings</h1><p className="text-gray-600 mt-1">{filteredDrawings.length} drawings in collection</p></div>
        <Link href="/admin/add" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center mt-4 md:mt-0"><FaPlus className="mr-2" /> Add New</Link>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative"><FaSearch className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search by title or artist..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">{categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}</select>
        </div>
      </div>
      {filteredDrawings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md"><div className="text-6xl mb-4">🖼️</div><h3 className="text-2xl font-semibold mb-2">No drawings found</h3><p className="text-gray-600 mb-6">Add your first drawing to get started</p><Link href="/admin/add" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">Add Drawing</Link></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrawings.map(drawing => (
            <div key={drawing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                {drawing.image && (drawing.image.startsWith('data:') || drawing.image.startsWith('http')) ? <img src={drawing.image} alt={drawing.title} className="h-full w-full object-cover" /> : <span className="text-6xl">{drawing.image || '🎨'}</span>}
                {drawing.featured && <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center"><FaStar className="mr-1" /> Featured</div>}
                {drawing.inStock !== false ? <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center"><FaCheckCircle className="mr-1" /> In Stock</div> : <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center"><FaTimesCircle className="mr-1" /> Out of Stock</div>}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1"><h3 className="font-semibold text-lg truncate flex-1">{drawing.title}</h3><span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2 whitespace-nowrap">{drawing.category || 'Uncategorized'}</span></div>
                <p className="text-gray-600 text-sm">by {drawing.artist}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-blue-600">${drawing.price}</span>
                  <div className="flex space-x-2">
                    <Link href={`/admin/edit/${drawing.id}`} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition" title="Edit"><FaEdit /></Link>
                    <button onClick={() => toggleFeatured(drawing.id)} className={`p-2 rounded transition ${drawing.featured ? 'text-yellow-500 hover:text-yellow-700' : 'text-gray-400 hover:text-yellow-500'}`} title="Toggle featured"><FaStar /></button>
                    <button onClick={() => handleDelete(drawing.id, drawing.title)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
