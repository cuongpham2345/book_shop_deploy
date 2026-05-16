import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, BookOpen, Menu, X, Bell, ShieldCheck, Store, Package } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

export function Header() {
  const { user, logout, isAuthenticated, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { unreadCount } = useNotifications()

  const isAdminPage = location.pathname.startsWith('/admin')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">Book<span className="text-indigo-600">Shop</span></span>
          </Link>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {(!hasRole('ADMIN') || isAdminPage) && (
                  <NavLink to="/notifications" className={({ isActive }) =>
                    `relative p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`
                  }>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </NavLink>
                )}

                {!hasRole('ADMIN') && !hasRole('SELLER') && (
                  <>
                    <NavLink to="/cart" className={({ isActive }) =>
                      `p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`
                    }>
                      <ShoppingCart className="h-5 w-5" />
                    </NavLink>
                    <NavLink to="/orders" className={({ isActive }) =>
                      `hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                    }>
                      <Package className="h-4 w-4" /> Đơn hàng của tôi
                    </NavLink>
                  </>
                )}

                {hasRole('ADMIN') ? (
                  /* Admin: click tên → /admin, logout icon riêng */
                  <div className="flex items-center gap-1">
                    <Link to="/admin"
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span className="hidden sm:block max-w-24 truncate">{user?.fullName || user?.username}</span>
                    </Link>
                    <button onClick={handleLogout} title="Đăng xuất"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : hasRole('SELLER') ? (
                  /* Seller: click tên → /seller/dashboard, logout icon riêng */
                  <div className="flex items-center gap-1">
                    <Link to="/seller/dashboard"
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Store className="h-4 w-4" />
                      <span className="hidden sm:block max-w-24 truncate">{user?.fullName || user?.username}</span>
                    </Link>
                    <button onClick={handleLogout} title="Đăng xuất"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  /* User: click tên → thẳng tới thông tin cá nhân, logout icon riêng */
                  <div className="flex items-center gap-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:block max-w-24 truncate">{user?.fullName || user?.username}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      title="Đăng xuất"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline px-3 py-1.5 text-sm">Đăng nhập</Link>
                <Link to="/register" className="btn-primary px-3 py-1.5 text-sm hidden sm:inline-flex">Đăng ký</Link>
              </div>
            )}

            <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden py-3 border-t border-gray-100 space-y-1">
            {isAuthenticated && !hasRole('ADMIN') && !hasRole('SELLER') && (
              <NavLink to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Đơn hàng của tôi</NavLink>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
