'use client'

import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Coudra Art Shop</h3>
            <p className="text-gray-400">Discover unique artwork from talented artists</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/drawings" className="text-gray-400 hover:text-white transition">Gallery</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-white transition">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: artvalentin@gmail.com</p>
            <p className="text-gray-400">Phone: +250 793 174 951</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Coudra Art Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
