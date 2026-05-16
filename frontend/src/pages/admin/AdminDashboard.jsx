import { Link } from 'react-router-dom'
import { Users, Tag, BookOpen, Store, ArrowRight, ShieldCheck, History, UserCircle, ClipboardList } from 'lucide-react'

const SECTIONS = [
  {
    title:       'Quản lý tài khoản',
    description: 'Quản lý người dùng, phân quyền và khóa/mở tài khoản',
    icon:        Users,
    color:       'bg-violet-50 text-violet-600',
    border:      'border-violet-100 hover:border-violet-300',
    to:          '/admin/users',
  },
  {
    title:       'Quản lý bán hàng',
    description: 'Quản lý các shop đang bán hàng, khóa/mở khóa tài khoản seller',
    icon:        Store,
    color:       'bg-emerald-50 text-emerald-600',
    border:      'border-emerald-100 hover:border-emerald-300',
    to:          '/admin/sellers',
  },
  {
    title:       'Quản lý danh mục',
    description: 'Thêm, sửa, xóa các danh mục sách trong hệ thống',
    icon:        Tag,
    color:       'bg-amber-50 text-amber-600',
    border:      'border-amber-100 hover:border-amber-300',
    to:          '/admin/categories',
  },
  {
    title:       'Quản lý sản phẩm',
    description: 'Xem tất cả sách, kiểm duyệt sản phẩm của các shop',
    icon:        BookOpen,
    color:       'bg-rose-50 text-rose-600',
    border:      'border-rose-100 hover:border-rose-300',
    to:          '/admin/books',
  },
  {
    title:       'Lịch sử thay đổi',
    description: 'Xem log toàn bộ thao tác tạo, sửa, xóa, khóa tài khoản và sản phẩm',
    icon:        History,
    color:       'bg-slate-50 text-slate-600',
    border:      'border-slate-100 hover:border-slate-300',
    to:          '/admin/audit-logs',
  },
  {
    title:       'Yêu cầu chỉnh sửa',
    description: 'Xét duyệt yêu cầu cập nhật thông tin cá nhân từ các seller',
    icon:        ClipboardList,
    color:       'bg-cyan-50 text-cyan-600',
    border:      'border-cyan-100 hover:border-cyan-300',
    to:          '/admin/profile-requests',
  },
  {
    title:       'Thông tin cá nhân',
    description: 'Xem và cập nhật thông tin tài khoản của bạn',
    icon:        UserCircle,
    color:       'bg-indigo-50 text-indigo-600',
    border:      'border-indigo-100 hover:border-indigo-300',
    to:          '/profile',
  },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản trị hệ thống</h1>
          <p className="text-sm text-gray-500 mt-0.5">Chọn mục cần quản lý bên dưới</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {SECTIONS.map(({ title, description, icon: Icon, color, border, to }) => (
          <Link
            key={title}
            to={to}
            className={`card p-6 flex items-start gap-4 border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${border}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-300 shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}
