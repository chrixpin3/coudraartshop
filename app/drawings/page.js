'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaShoppingCart, FaStar, FaSearch, FaPalette, FaArtstation } from 'react-icons/fa'
import { useCart } from '@/lib/CartContext'

export default function DrawingList() {
  const [drawings, setDrawings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadDrawings() {
      try {
        const res = await fetch('/api/drawings')
        const data = await res.json()
        setDrawings(data)
      } catch {
        setDrawings([])
      }
      setLoading(false)
    }
    loadDrawings()
  }, [])

  const categories = ['all', ...new Set(drawings.map(d => d.category).filter(Boolean))]
  const filteredDrawings = drawings.filter(drawing => {
    const matchesSearch = drawing.title?.toLowerCase().includes(searchTerm.toLowerCase()) || drawing.artist?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || drawing.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (drawing) => {
    addToCart({ id: drawing.id, title: drawing.title, artist: drawing.artist, price: drawing.price, image: drawing.image || drawing.imagePlaceholder || '🎨', quantity: 1 })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 blur-2xl rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold"><span className="gradient-text">Artwork Gallery</span></h1>
                <p className="text-gray-600 mt-2 flex items-center"><FaPalette className="mr-2 text-primary-500" /> Explore our collection of unique artwork</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-gray-400">
                <FaArtstation className="text-2xl text-primary-400" />
                <span className="text-sm">{filteredDrawings.length} pieces</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="Search by title or artist..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50 backdrop-blur-sm" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50 backdrop-blur-sm">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-gray-600 mb-4 flex items-center">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-3 py-1 rounded-full mr-2">{filteredDrawings.length}</span>
          items found
        </p>

        {filteredDrawings.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-card border border-white/30">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No drawings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all') }} className="btn-primary mt-4 inline-block">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDrawings.map((drawing) => (
              <div key={drawing.id} className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-card overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-white/30">
                <Link href={`/drawings/${drawing.id}`}>
                  <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {drawing.image ? (
                      <img src={drawing.image} alt={drawing.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{drawing.imagePlaceholder || '🎨'}</span>
                    )}
                    {drawing.inStock === false && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 py-2 bg-rose-500 rounded-full shadow-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">{drawing.category || 'Art'}</span>
                    <span className="flex items-center text-yellow-500 text-sm"><FaStar className="mr-1" /> {drawing.rating || 0}</span>
                  </div>
                  <Link href={`/drawings/${drawing.id}`}>
                    <h3 className="font-bold text-lg hover:text-primary-600 transition line-clamp-1">{drawing.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">by {drawing.artist}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-2xl font-bold text-primary-600">${drawing.price}</span>
                    <button onClick={() => handleAddToCart(drawing)} disabled={drawing.inStock === false} className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center text-sm font-semibold ${drawing.inStock !== false ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                      <FaShoppingCart className="mr-2" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
