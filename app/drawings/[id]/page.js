'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaStar, FaShoppingCart, FaHeart, FaShare, FaCheck, FaMinus, FaPlus, FaImage, FaPlay } from 'react-icons/fa'
import { useCart } from '@/lib/CartContext'
import toast from 'react-hot-toast'

export default function DrawingDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [drawing, setDrawing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)

  useEffect(() => {
    async function loadDrawing() {
      try {
        const res = await fetch(`/api/drawings/${id}`)
        if (!res.ok) throw new Error('Not found')
        const found = await res.json()
        setDrawing(found)
      } catch {
        toast.error('Drawing not found')
        router.push('/drawings')
      }
      setLoading(false)
    }
    loadDrawing()
  }, [id, router])

  const handleAddToCart = () => {
    if (!drawing || drawing.inStock === false) return
    addToCart({ id: drawing.id, title: drawing.title, artist: drawing.artist, price: drawing.price, image: drawing.image || drawing.imagePlaceholder || '🎨', quantity })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!drawing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Drawing not found</h2>
        <Link href="/drawings" className="text-blue-600 hover:underline">Back to Gallery</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/drawings" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
        <FaArrowLeft className="mr-2" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="relative h-[400px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
            {drawing.image ? (
              <img src={drawing.image} alt={drawing.title} className="h-full w-full object-contain" />
            ) : (
              <span className="text-9xl">{drawing.imagePlaceholder || '🎨'}</span>
            )}
            {drawing.media && drawing.media.length > 0 && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {drawing.media.some(m => m.type === 'image') && (
                  <button onClick={() => { const m = drawing.media.find(m => m.type === 'image'); if (m) { setSelectedMedia(m); setShowMediaModal(true) } }} className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm flex items-center hover:bg-opacity-80 transition">
                    <FaImage className="mr-1" /> {drawing.media.filter(m => m.type === 'image').length}
                  </button>
                )}
                {drawing.media.some(m => m.type === 'video') && (
                  <button onClick={() => { const m = drawing.media.find(m => m.type === 'video'); if (m) { setSelectedMedia(m); setShowMediaModal(true) } }} className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm flex items-center hover:bg-opacity-80 transition">
                    <FaPlay className="mr-1" /> {drawing.media.filter(m => m.type === 'video').length}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{drawing.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {drawing.artist}</p>
            </div>
            <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full ${isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'} hover:bg-red-100 hover:text-red-500 transition`}>
              <FaHeart className="text-xl" />
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (<FaStar key={i} className={i < Math.floor(drawing.rating || 0) ? 'text-yellow-500' : 'text-gray-300'} />))}
            </div>
            <span className="ml-2 text-gray-600">({drawing.reviews || 0} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-600">${drawing.price}</span>
            {drawing.inStock !== false && drawing.stock > 0 ? (
              <span className="ml-4 inline-flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm"><FaCheck className="mr-1" /> In Stock ({drawing.stock} available)</span>
            ) : (
              <span className="ml-4 inline-flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">Out of Stock</span>
            )}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{drawing.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div><p className="text-sm text-gray-500">Category</p><p className="font-semibold">{drawing.category || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Dimensions</p><p className="font-semibold">{drawing.dimensions || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Year</p><p className="font-semibold">{drawing.year || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Medium</p><p className="font-semibold">{drawing.medium || 'N/A'}</p></div>
          </div>

          {drawing.inStock !== false && drawing.stock > 0 ? (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => { if (quantity > 1) setQuantity(quantity - 1) }} className="px-4 py-2 hover:bg-gray-100 transition" disabled={quantity <= 1}><FaMinus /></button>
                <span className="px-6 py-2 border-x border-gray-300 min-w-[4rem] text-center font-semibold">{quantity}</span>
                <button onClick={() => { if (quantity < (drawing.stock || 10)) setQuantity(quantity + 1) }} className="px-4 py-2 hover:bg-gray-100 transition" disabled={quantity >= (drawing.stock || 10)}><FaPlus /></button>
              </div>
              <button onClick={handleAddToCart} className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center ${addedToCart ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {addedToCart ? '✓ Added to Cart' : <><FaShoppingCart className="mr-2" /> Add to Cart</>}
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-600 font-semibold">This artwork is currently out of stock</p>
            </div>
          )}

          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied to clipboard!') }} className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center text-gray-600">
            <FaShare className="mr-2" /> Share this artwork
          </button>
        </div>
      </div>

      {showMediaModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">{drawing.title}</h3>
              <button onClick={() => setShowMediaModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh] flex items-center justify-center bg-gray-100">
              {selectedMedia.type === 'video' ? (
                <div className="w-full aspect-video"><iframe src={selectedMedia.url} title={`${drawing.title} video`} className="w-full h-full" allowFullScreen /></div>
              ) : (
                <img src={selectedMedia.url} alt={drawing.title} className="max-w-full max-h-[60vh] object-contain" />
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">{selectedMedia.title || 'Media'}</p>
              <button onClick={() => setShowMediaModal(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
