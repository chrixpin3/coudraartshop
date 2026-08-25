'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaShoppingCart, FaUser, FaSignOutAlt, FaLock } from 'react-icons/fa'
import { useCart } from '@/lib/CartContext'

const Navbar = () => {
  const router = useRouter()
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  let isAdmin = false
  if (typeof window !== 'undefined') {
    const admin = JSON.parse(localStorage.getItem('admin') || 'null')
    isAdmin = !!admin
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    router.push('/')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Coudra Art Shop
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/drawings" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium hover:scale-105 transform">
              Gallery
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium hover:scale-105 transform">
              About
            </Link>

            {isAdmin ? (
              <>
                <Link href="/admin" className="text-white bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center hover:scale-105 transform">
                  <FaUser className="mr-2" /> Admin
                </Link>
                <button onClick={handleLogout} className="text-rose-500 hover:text-rose-700 transition-colors duration-300 flex items-center font-medium">
                  <FaSignOutAlt className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <Link href="/admin/login" className="text-gray-600 hover:text-primary-600 transition-colors duration-300 flex items-center font-medium">
                <FaLock className="mr-1 text-xs" /> Admin
              </Link>
            )}

            <Link href="/cart" className="relative group">
              <div className="text-2xl text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
                <FaShoppingCart />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
