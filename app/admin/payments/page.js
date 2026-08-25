'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminPaymentApproval() {
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('payments')
    if (saved) { const p = JSON.parse(saved); setPayments(p); setFilteredPayments(p) }
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = payments
    if (searchTerm) filtered = filtered.filter(p => p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone?.includes(searchTerm) || p.orderId?.toLowerCase().includes(searchTerm.toLowerCase()))
    if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter)
    setFilteredPayments(filtered)
  }, [searchTerm, statusFilter, payments])

  const handleApprove = async (paymentId) => {
    const payment = payments.find(p => p.id === paymentId)
    if (!payment) return

    if (payment.items && payment.items.length > 0) {
      try {
        const res = await fetch('/api/drawings')
        const drawings = await res.json()
        for (const item of payment.items) {
          const drawing = drawings.find(d => d.title === item.title)
          if (drawing) {
            const newStock = Math.max(0, (drawing.stock || 0) - item.quantity)
            await fetch(`/api/drawings/${drawing.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...drawing, stock: newStock }),
            })
          }
        }
      } catch { /* continue with local update */ }
    }

    const updatedPayments = payments.map(p =>
      p.id === paymentId ? { ...p, status: 'approved', approvedAt: new Date().toISOString() } : p
    )
    setPayments(updatedPayments)
    localStorage.setItem('payments', JSON.stringify(updatedPayments))
    toast.success('Payment approved and stock updated!')
  }

  const handleReject = (paymentId) => {
    if (window.confirm('Are you sure you want to reject this payment?')) {
      const updated = payments.map(p => p.id === paymentId ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p)
      setPayments(updated); localStorage.setItem('payments', JSON.stringify(updated)); toast.error('Payment rejected')
    }
  }

  const getStatusBadge = (status) => ({ pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="mr-1" />, label: 'Pending' }, approved: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" />, label: 'Approved' }, rejected: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" />, label: 'Rejected' } }[status] || { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="mr-1" />, label: 'Pending' })

  if (loading) return <div className="container mx-auto px-4 py-16 text-center"><FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" /><p className="text-gray-600">Loading payments...</p></div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-3xl font-bold">💳 Payment Approvals</h1><p className="text-gray-600 mt-1">{filteredPayments.length} payments found ({payments.filter(p => p.status === 'pending').length} pending)</p></div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative"><FaSearch className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search by name, phone, or order ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Order ID','Customer','Phone','Amount','Status','Actions'].map(h=><th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (<tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No payments found</td></tr>) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{payment.orderId || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.customerName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">${(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status).color} flex items-center w-fit`}>{getStatusBadge(payment.status).icon}{getStatusBadge(payment.status).label}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex space-x-2">{payment.status === 'pending' && <><button onClick={() => handleApprove(payment.id)} className="text-green-600 hover:text-green-800" title="Approve"><FaCheckCircle /></button><button onClick={() => handleReject(payment.id)} className="text-red-600 hover:text-red-800" title="Reject"><FaTimesCircle /></button></>}</div></td>
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
