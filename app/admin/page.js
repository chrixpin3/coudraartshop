'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaShoppingBag, FaUsers, FaSignOutAlt, FaPaintBrush, FaDollarSign, FaMoneyBillWave, FaEye, FaClock, FaCheckCircle } from 'react-icons/fa'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ totalDrawings: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0, pendingPayments: 0, totalCustomers: 0, completedOrders: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [drawingsRes] = await Promise.all([
          fetch('/api/drawings'),
        ])
        const drawings = await drawingsRes.json()
        const payments = JSON.parse(localStorage.getItem('payments') || '[]')
        const pendingPayments = payments.filter(p => p.status === 'pending').length
        const approvedPayments = payments.filter(p => p.status === 'approved').length
        const totalRevenue = payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0)
        const uniqueCustomers = new Set()
        payments.forEach(p => { if (p.customerName) uniqueCustomers.add(p.customerName) })

        setStats({
          totalDrawings: drawings.length, totalOrders: payments.length, totalRevenue,
          pendingOrders: payments.filter(p => p.status === 'pending').length,
          pendingPayments, totalCustomers: uniqueCustomers.size, completedOrders: approvedPayments
        })
        setRecentOrders(payments.slice(0, 5).map(p => ({
          id: p.orderId || `ORD-${p.id}`, customer: p.customerName || 'Unknown',
          total: p.amount || 0, status: p.status || 'pending',
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
        })))
      } catch { /* ignore */ }
      setLoading(false)
    }
    loadStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  const getStatusColor = (status) => ({ pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-800')
  const getStatusIcon = (status) => {
    const icons = { pending: <FaClock className="text-yellow-500" />, approved: <FaCheckCircle className="text-green-500" />, rejected: <FaClock className="text-red-500" /> }
    return icons[status] || <FaClock className="text-gray-500" />
  }

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i=><div key={i} className="bg-white rounded-xl shadow-card p-6"><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-8 bg-gray-200 rounded w-3/4"></div></div>)}</div></div></div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time store statistics and management</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link href="/admin/add" className="btn-primary text-sm"><FaPlus className="mr-2" /> Add Drawing</Link>
          <button onClick={handleLogout} className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center text-sm font-semibold"><FaSignOutAlt className="mr-2" /> Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-primary-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 font-medium">Total Drawings</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDrawings}</p></div><div className="bg-gradient-to-br from-primary-400 to-primary-500 p-3 rounded-2xl"><FaPaintBrush className="text-white text-xl" /></div></div>
          <Link href="/admin/manage" className="text-sm text-primary-600 hover:text-primary-700 mt-2 block font-medium">Manage collection →</Link>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-success-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 font-medium">Total Orders</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p></div><div className="bg-gradient-to-br from-success-400 to-success-500 p-3 rounded-2xl"><FaShoppingBag className="text-white text-xl" /></div></div>
          <div className="mt-2 flex space-x-2 text-xs"><span className="text-yellow-600">Pending: {stats.pendingOrders}</span><span className="text-green-600">Completed: {stats.completedOrders}</span></div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-accent-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 font-medium">Total Revenue</p><p className="text-3xl font-bold text-success-600 mt-1">${stats.totalRevenue.toFixed(2)}</p></div><div className="bg-gradient-to-br from-accent-400 to-accent-500 p-3 rounded-2xl"><FaDollarSign className="text-white text-xl" /></div></div>
          <p className="text-sm text-gray-500 mt-1">From {stats.completedOrders} completed orders</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-secondary-500 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between"><div><p className="text-sm text-gray-600 font-medium">Total Customers</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p></div><div className="bg-gradient-to-br from-secondary-400 to-secondary-500 p-3 rounded-2xl"><FaUsers className="text-white text-xl" /></div></div>
          <p className="text-sm text-gray-500 mt-1">Unique customers</p>
        </div>
      </div>

      {stats.pendingPayments > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center"><FaMoneyBillWave className="text-yellow-600 text-2xl mr-3" /><div><h3 className="font-semibold text-yellow-800">Pending Payments</h3><p className="text-sm text-yellow-700">{stats.pendingPayments} payment{stats.pendingPayments > 1 ? 's' : ''} awaiting approval</p></div></div>
            <Link href="/admin/payments" className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition flex items-center text-sm font-semibold"><FaEye className="mr-2" /> Review Now</Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/add" className="group bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-800">Add New</h3><p className="text-sm text-gray-600 mt-1">Upload artwork</p></div><div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/30"><FaPlus /></div></div>
        </Link>
        <Link href="/admin/manage" className="group bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-800">Manage</h3><p className="text-sm text-gray-600 mt-1">Edit or delete</p></div><div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-success-500/30"><FaEdit /></div></div>
        </Link>
        <Link href="/admin/payments" className="group bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-800">Payments</h3><p className="text-sm text-gray-600 mt-1">Approve payments</p></div><div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-gold-500/30"><FaMoneyBillWave /></div></div>
          {stats.pendingPayments > 0 && <span className="mt-2 inline-block bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{stats.pendingPayments} pending</span>}
        </Link>
      </div>

      {recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div><h2 className="text-xl font-bold text-gray-900">Recent Orders</h2><p className="text-sm text-gray-500">Latest {recentOrders.length} orders</p></div>
            <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>{['Order ID','Customer','Total','Status','Date','Actions'].map(h=><th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} flex items-center w-fit`}>{getStatusIcon(order.status)}<span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><Link href="/admin/payments" className="text-primary-600 hover:text-primary-700"><FaEye /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {recentOrders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Orders will appear here once customers make purchases</p>
          <Link href="/" className="btn-primary mt-6 inline-block">View Store</Link>
        </div>
      )}
    </div>
  )
}
