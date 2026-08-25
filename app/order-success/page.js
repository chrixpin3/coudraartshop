'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FaCheckCircle, FaPrint } from 'react-icons/fa'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6 text-green-500 flex justify-center"><FaCheckCircle /></div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/drawings" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Continue Shopping</Link>
          <button onClick={() => window.print()} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center">
            <FaPrint className="mr-2" /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
