'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaLock } from 'react-icons/fa'
import { useCart } from '@/lib/CartContext'

export default function Cart() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, getTotalItems, getCartTotal } = useCart()
  const { subtotal, shipping, tax, total } = getCartTotal()

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any artwork to your cart yet.</p>
          <Link href="/drawings" className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            <FaShoppingBag className="mr-2" /> Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mr-4"><FaArrowLeft /></button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="ml-4 bg-gray-200 px-3 py-1 rounded-full text-sm">{getTotalItems()} items</span>
        </div>
        <button onClick={() => { if (window.confirm('Are you sure you want to clear your cart?')) { cart.items.forEach(item => removeFromCart(item.id)) } }} className="text-red-600 hover:text-red-800 transition">Clear Cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <div className="text-5xl mr-4">{item.image}</div>
                    <div className="flex-1">
                      <Link href={`/drawings/${item.id}`} className="font-semibold hover:text-blue-600 transition">{item.title}</Link>
                      <p className="text-gray-600 text-sm">by {item.artist}</p>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 transition"><FaMinus className="text-xs" /></button>
                        <span className="px-4 py-1 min-w-[2rem] text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 transition"><FaPlus className="text-xs" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition p-2"><FaTrash /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/drawings" className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4 transition">
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal ({getTotalItems()} items)</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
              {shipping === 0 && subtotal > 0 && <div className="text-sm text-green-600">🎉 Free shipping on orders over $500!</div>}
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold"><span>Total</span><span className="text-blue-600">${total.toFixed(2)}</span></div>
            </div>
            <Link href="/checkout" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-center block font-semibold">Proceed to Checkout</Link>
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500"><FaLock className="mr-1" /> Secure checkout</div>
          </div>
        </div>
      </div>
    </div>
  )
}
