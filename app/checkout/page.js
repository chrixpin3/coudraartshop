'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaUser, FaPhone, FaHome, FaArrowRight, FaShieldAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { useCart } from '@/lib/CartContext'
import toast from 'react-hot-toast'

export default function Checkout() {
  const router = useRouter()
  const { cart, clearCart, getCartTotal } = useCart()
  const { subtotal, shipping, tax, total } = getCartTotal()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  const [transactionCode, setTransactionCode] = useState('')
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const generateTransactionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
    return code
  }

  const handleSubmitPayment = () => {
    setIsProcessing(true)
    const code = generateTransactionCode()
    setTransactionCode(code)

    const payment = {
      id: Date.now(), orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      customerName: formData.fullName, phone: formData.phone, amount: total,
      provider: 'airtel', transactionCode: code, status: 'pending',
      createdAt: new Date().toISOString(),
      items: cart.items.map(item => ({ title: item.title, quantity: item.quantity, price: item.price })),
      address: formData.address
    }

    const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]')
    localStorage.setItem('payments', JSON.stringify([payment, ...existingPayments]))
    clearCart()
    setPaymentSubmitted(true)
    setIsProcessing(false)
    toast.success('📱 Payment request submitted! Awaiting admin approval.')
  }

  const handleContinueToPayment = () => {
    if (formData.fullName && formData.phone && formData.address) {
      setStep(2)
    } else {
      toast.error('Please fill in all shipping information')
    }
  }

  if (cart.items.length === 0 && !paymentSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/drawings" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block">Browse Artwork</Link>
      </div>
    )
  }

  if (paymentSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4 flex justify-center"><FaCheckCircle className="text-yellow-500" /></div>
          <h1 className="text-3xl font-bold mb-2">Payment Submitted!</h1>
          <p className="text-gray-600 mb-4">Your payment request has been sent for approval.</p>
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-yellow-800">Transaction Details:</p>
            <p className="text-sm text-yellow-700"><strong>Amount:</strong> ${total.toFixed(2)}</p>
            <p className="text-sm text-yellow-700"><strong>Code:</strong> <span className="font-mono">{transactionCode}</span></p>
            <p className="text-sm text-yellow-700"><strong>Status:</strong> <span className="font-semibold">Pending Approval</span></p>
          </div>
          <p className="text-sm text-gray-500 mb-6">You will receive a confirmation once the admin approves your payment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Continue Shopping</Link>
            <Link href="/drawings" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition">Browse More Art</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {step === 1 ? (
        <div>
          <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
            <FaArrowLeft className="mr-2" /> Back to Cart
          </button>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">Enter your shipping details to continue</p>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
              <h2 className="text-xl font-bold">Shipping Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative"><FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your full name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative"><FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+250 793 174 951" />
                </div>
                <p className="text-xs text-gray-500 mt-1">📱 Your phone number for payment confirmation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <div className="relative"><FaHome className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="123 Main St, Kigali, Rwanda" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleContinueToPayment} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center">
                Continue to Payment <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Subtotal ({cart.items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="border-t pt-2 font-bold flex justify-between text-lg"><span>Total</span><span className="text-blue-600">${total.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <FaShieldAlt className="text-green-500 mr-2" /><span>Secure checkout with Mobile Money</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button onClick={() => setStep(1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
            <FaArrowLeft className="mr-2" /> Back to Shipping
          </button>
          <h2 className="text-2xl font-bold mb-4 flex items-center"><span className="mr-2">💰</span> Submit Payment Request</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 font-semibold mb-2">📱 How to pay:</p>
              <p className="text-sm text-blue-600">Send the exact amount to the following mobile money number:</p>
              <div className="mt-3 bg-white rounded-lg p-4 text-center border-2 border-dashed border-blue-300">
                <p className="text-sm text-gray-500">Mobile Money Number</p>
                <p className="text-3xl font-bold text-blue-600">+250 793 174 951</p>
                <p className="text-xs text-gray-400 mt-1">Airtel Money / MTN Mobile Money</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-700 mb-2">Payment Summary:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Amount to send:</span><strong className="text-green-600">${total.toFixed(2)}</strong></div>
                <div className="flex justify-between"><span className="text-gray-600">Mobile Money:</span><strong>+250 793 174 951</strong></div>
                <div className="flex justify-between"><span className="text-gray-600">Reference:</span><strong className="font-mono text-blue-600">{generateTransactionCode()}</strong></div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700 flex items-start"><span className="mr-2">⚠️</span><span>Include the reference code when sending money for faster approval</span></p>
            </div>
            <button onClick={handleSubmitPayment} disabled={isProcessing} className={`w-full py-4 rounded-lg transition font-semibold text-lg flex items-center justify-center ${isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
              {isProcessing ? <><FaSpinner className="animate-spin mr-2" /> Processing...</> : <>💰 I've Sent the Money</>}
            </button>
            <p className="text-xs text-gray-400 text-center">Your payment will be verified by the admin before order confirmation</p>
          </div>
        </div>
      )}
    </div>
  )
}
