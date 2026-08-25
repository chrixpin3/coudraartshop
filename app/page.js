'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaShoppingCart, FaStar, FaArrowRight, FaPalette, FaHeart, FaAward } from 'react-icons/fa'
import { useCart } from '@/lib/CartContext'

export default function Home() {
  const [featuredDrawings, setFeaturedDrawings] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const savedDrawings = localStorage.getItem('drawings')
    if (savedDrawings) {
      try {
        const parsed = JSON.parse(savedDrawings)
        const featured = parsed.filter(d => d.featured === true)
        setFeaturedDrawings(featured.length > 0 ? featured : parsed.slice(0, 4))
      } catch {
        setFeaturedDrawings([])
      }
    } else {
      setFeaturedDrawings([])
    }
    setLoading(false)
  }, [])

  const handleAddToCart = (drawing) => {
    addToCart({ id: drawing.id, title: drawing.title, artist: drawing.artist, price: drawing.price, image: drawing.image || '🎨', quantity: 1 })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="relative overflow-hidden hero-gradient text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl animate-float">🎨</div>
          <div className="absolute bottom-10 right-10 text-9xl animate-float" style={{ animationDelay: '2s' }}>🖼️</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5">✨</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <span className="text-sm font-semibold tracking-wider">🎉 Discover Art</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
              Unique Artwork
            </span>
            <br />
            <span className="text-white">For Every Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Explore our curated collection of hand-drawn artwork from talented artists around the world
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/drawings" className="btn-gold text-lg px-10 py-4 rounded-full shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50">
              Browse Gallery
            </Link>
            <Link href="/about" className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <p className="text-gray-600 mt-1">Artworks</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-600">150+</div>
              <p className="text-gray-600 mt-1">Artists</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-600">30+</div>
              <p className="text-gray-600 mt-1">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-500">4.9</div>
              <p className="text-gray-600 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold">
              <span className="gradient-text">Featured Artwork</span>
            </h2>
            <p className="text-gray-600 mt-2">Handpicked by our curators</p>
          </div>
          <Link href="/drawings" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center group">
            View All <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {featuredDrawings.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-card border border-white/30">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold mb-2">No Artwork Yet</h3>
            <p className="text-gray-600">Check back later for new artwork from our artists</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDrawings.map((drawing) => (
              <div key={drawing.id} className="group bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]">
                <Link href={`/drawings/${drawing.id}`}>
                  <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {drawing.image && drawing.image.startsWith('data:') ? (
                      <img src={drawing.image} alt={drawing.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{drawing.image || '🎨'}</span>
                    )}
                    {drawing.featured && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">⭐ Featured</span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span>{drawing.rating || 0}</span>
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 px-2.5 py-1 rounded-full font-medium">{drawing.category || 'Art'}</span>
                  </div>
                  <Link href={`/drawings/${drawing.id}`}>
                    <h3 className="font-bold text-lg hover:text-primary-600 transition line-clamp-1">{drawing.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">by {drawing.artist}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-2xl font-bold text-primary-600">${drawing.price}</span>
                    <button onClick={() => handleAddToCart(drawing)} className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center text-sm font-semibold">
                      <FaShoppingCart className="mr-2" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              <span className="gradient-text">Why Choose Us</span>
            </h2>
            <p className="text-gray-600 mt-2">What makes Coudra Art Shop special</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaPalette className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unique Artwork</h3>
              <p className="text-gray-600">Discover one-of-a-kind pieces from talented artists worldwide</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Curated Collections</h3>
              <p className="text-gray-600">Every piece is carefully selected for quality and beauty</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Authenticity Guaranteed</h3>
              <p className="text-gray-600">All artworks come with a certificate of authenticity</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl p-12 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 text-9xl">🎨</div>
            <div className="absolute bottom-0 left-0 text-9xl">🖼️</div>
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6 opacity-90">Subscribe for updates on new artwork and exclusive offers</p>
            <div className="max-w-md mx-auto flex">
              <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-l-2xl focus:outline-none text-gray-800 bg-white/90 backdrop-blur-sm" />
              <button className="bg-gradient-to-r from-gold-400 to-gold-500 text-white px-8 py-4 rounded-r-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
