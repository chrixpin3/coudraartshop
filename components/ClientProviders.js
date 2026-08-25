'use client'

import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/lib/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ClientProviders({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </CartProvider>
  )
}
