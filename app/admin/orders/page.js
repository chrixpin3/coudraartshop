'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaEye, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]')
    setOrders(payments.map(p => ({
      id: p.orderId || `ORD-${p.id}`,
      customer: p.customerName || 'Unknown',
      email: p.phone || '',
      items: p.items?.length || 0,
      total: p.amount || 0,
      status: p.status || 'pending',
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'
    })))
  }, [])

  const getStatusColor = (status) => ({ pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800', shipped: 'bg-purple-100 text-purple-800', approved: 'bg-green-100 text-green-800', delivered: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', cancelled: 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-800')
  const getStatusIcon = (status) => {
    const icons = { pending: <FaClock className="text-yellow-500 mr-1" />, processing: <FaClock className="text-blue-500 mr-1" />, shipped: <FaCheckCircle className="text-purple-500 mr-1" />, approved: <FaCheckCircle className="text-green-500 mr-1" />, delivered: <FaCheckCircle className="text-green-500 mr-1" />, rejected: <FaTimesCircle className="text-red-500 mr-1" />, cancelled: <FaTimesCircle className="text-red-500 mr-1" /> }
    return icons[status] || null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 mr-4"><FaArrowLeft /></Link>
        <h1 className="text-3xl font-bold">Orders</h1>
        <span className="ml-4 bg-gray-200 px-3 py-1 rounded-full text-sm">{orders.length} orders</span>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Order ID','Customer','Items','Total','Status','Date','Actions'].map(h=><th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders yet</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">{order.customer}</div><div className="text-sm text-gray-500">{order.email}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} flex items-center`}>{getStatusIcon(order.status)}{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><button className="text-blue-600 hover:text-blue-800"><FaEye /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
