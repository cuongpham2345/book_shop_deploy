import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, TrendingUp, Clock, CheckCircle, Package,
  Truck, BookOpen, ArrowRight, BarChart2, XCircle, UserCircle,
} from 'lucide-react'
import { ordersApi } from '../../api/orders'
import { PageSpinner } from '../../components/ui/Spinner'

function fmt(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
function fmtDate(s) {
  return new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const STATUS_LABEL = {
  PENDING:    'Chờ xác nhận',
  CONFIRMED:  'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING:   'Đang giao',
  DELIVERED:  'Đã giao',
  CANCELLED:  'Đã hủy',
  RETURNED:   'Đã hoàn trả',
}
const STATUS_COLOR = {
  PENDING:    'bg-yellow-100 text-yellow-700',
  CONFIRMED:  'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPING:   'bg-violet-100 text-violet-700',
  DELIVERED:  'bg-emerald-100 text-emerald-700',
  CANCELLED:  'bg-gray-100 text-gray-500',
  RETURNED:   'bg-red-100 text-red-600',
}
const STATUS_BAR = {
  PENDING:    'bg-yellow-400',
  CONFIRMED:  'bg-blue-400',
  PROCESSING: 'bg-indigo-400',
  SHIPPING:   'bg-violet-400',
  DELIVERED:  'bg-emerald-400',
  CANCELLED:  'bg-gray-300',
  RETURNED:   'bg-red-400',
}

export default function SellerDashboard() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getSellerOrders()
      .then((res) => setOrders(res.data.result || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const revenue = orders
    .filter(o => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
    .reduce((s, o) => s + Number(o.totalAmount), 0)

  const pending   = orders.filter(o => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(o.status)).length
  const delivered = orders.filter(o => o.status === 'DELIVERED').length
  const cancelled = orders.filter(o => o.status === 'CANCELLED').length

  const statusBreakdown = Object.entries(STATUS_LABEL).map(([key]) => ({
    key,
    count: orders.filter(o => o.status === key).length,
  })).filter(s => s.count > 0)

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard shop</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tổng quan hoạt động kinh doanh của bạn</p>
        </div>
        <div className="flex gap-2">
          <Link to="/profile"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors">
            <UserCircle className="h-4 w-4" /> Thông tin cá nhân
          </Link>
          <Link to="/seller/books"
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-colors">
            <BookOpen className="h-4 w-4" /> Quản lý sách
          </Link>
          <Link to="/seller/orders"
            className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl transition-colors">
            <ShoppingBag className="h-4 w-4" /> Đơn hàng
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: ShoppingBag,
            label: 'Tổng đơn hàng',
            value: orders.length,
            color: 'bg-indigo-50 text-indigo-600',
          },
          {
            icon: TrendingUp,
            label: 'Doanh thu',
            value: fmt(revenue),
            color: 'bg-emerald-50 text-emerald-600',
            small: true,
          },
          {
            icon: Clock,
            label: 'Đang xử lý',
            value: pending,
            color: 'bg-amber-50 text-amber-600',
          },
          {
            icon: CheckCircle,
            label: 'Đã giao thành công',
            value: delivered,
            color: 'bg-violet-50 text-violet-600',
          },
        ].map(({ icon: Icon, label, value, color, small }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className={`font-bold text-gray-900 ${small ? 'text-base' : 'text-2xl'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Breakdown by status */}
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-gray-800 text-sm">Theo trạng thái</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Chưa có đơn hàng</p>
          ) : (
            <div className="space-y-2.5">
              {statusBreakdown.map(({ key, count }) => {
                const pct = Math.round((count / orders.length) * 100)
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{STATUS_LABEL[key]}</span>
                      <span className="text-xs font-semibold text-gray-700">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${STATUS_BAR[key]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <h2 className="font-semibold text-gray-800 text-sm">Đơn hàng gần đây</h2>
            </div>
            <Link to="/seller/orders" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((order) => (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-semibold text-gray-700">{order.orderCode}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}>
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{order.recipientName} · {fmtDate(order.createdAt)}</p>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 shrink-0">{fmt(order.totalAmount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alert for pending orders */}
      {pending > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Clock className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            Bạn có <span className="font-bold">{pending} đơn hàng</span> đang chờ xử lý.
          </p>
          <Link to="/seller/orders" className="ml-auto text-sm font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1 shrink-0">
            Xử lý ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {cancelled > 0 && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <XCircle className="h-5 w-5 text-gray-400 shrink-0" />
          <p className="text-sm text-gray-600">
            <span className="font-bold">{cancelled} đơn hàng</span> đã bị hủy.
          </p>
        </div>
      )}
    </div>
  )
}
