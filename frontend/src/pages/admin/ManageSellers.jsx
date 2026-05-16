import { useEffect, useState } from 'react'
import {
  Store, Search, Trash2, X, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, BookOpen, Package, Plus, Pencil,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { usersApi } from '../../api/users'
import { booksApi } from '../../api/books'
import { PageSpinner } from '../../components/ui/Spinner'

function getActive(u) {
  if (typeof u.isActive === 'boolean') return u.isActive
  if (typeof u.active  === 'boolean') return u.active
  return true
}

function fmt(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('vi-VN') + '₫'
}

const EMPTY_FORM = {
  username: '', email: '', password: '', fullName: '',
  phoneNumber: '', address: '', isActive: true,
}

/* ─── Modal thêm / sửa seller ─── */
function SellerFormModal({ editData, onClose, onSaved }) {
  const isEdit = !!editData
  const [form, setForm]     = useState(isEdit ? {
    username:    editData.username    || '',
    email:       editData.email       || '',
    password:    '',
    fullName:    editData.fullName    || '',
    phoneNumber: editData.phoneNumber || '',
    address:     editData.address     || '',
    isActive:    getActive(editData),
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) { toast.error('Username không được để trống'); return }
    if (!form.email.trim())    { toast.error('Email không được để trống'); return }
    if (!isEdit && !form.password.trim()) { toast.error('Mật khẩu không được để trống'); return }

    setSaving(true)
    try {
      const payload = {
        username:    form.username,
        email:       form.email,
        fullName:    form.fullName,
        phoneNumber: form.phoneNumber,
        address:     form.address,
        role:        'SELLER',
        isActive:    form.isActive,
        active:      form.isActive,
      }
      if (form.password) payload.password = form.password

      if (isEdit) {
        await usersApi.update(editData.id, payload)
        toast.success('Cập nhật shop thành công!')
      } else {
        await usersApi.create(payload)
        toast.success('Thêm shop thành công!')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[92dvh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {isEdit ? 'Cập nhật thông tin shop' : 'Thêm shop mới'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={save} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Username <span className="text-rose-500">*</span>
              </label>
              <input
                value={form.username} onChange={set('username')}
                disabled={isEdit}
                placeholder="username"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                value={form.email} onChange={set('email')} type="email"
                placeholder="email@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Mật khẩu {!isEdit && <span className="text-rose-500">*</span>}
              {isEdit && <span className="font-normal text-gray-400"> (để trống nếu không đổi)</span>}
            </label>
            <input
              value={form.password} onChange={set('password')} type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tên shop / Họ tên</label>
            <input
              value={form.fullName} onChange={set('fullName')}
              placeholder="Nhà sách Minh Khai..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
              <input
                value={form.phoneNumber} onChange={set('phoneNumber')}
                placeholder="0912345678"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ</label>
              <input
                value={form.address} onChange={set('address')}
                placeholder="123 Nguyễn Huệ..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <input
                id="isActiveSeller"
                type="checkbox"
                checked={form.isActive}
                onChange={set('isActive')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="isActiveSeller" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Shop đang hoạt động
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors">
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Panel chi tiết shop ─── */
function SellerPanel({ seller, onClose, onDelete, lockingId, onEdit }) {
  const [books, setBooks]         = useState([])
  const [booksPage, setBooksPage] = useState(0)
  const [booksMeta, setBooksMeta] = useState(null)
  const [booksLoading, setBooksLoading] = useState(false)

  const active = getActive(seller)

  const fetchBooks = (page = 0) => {
    setBooksLoading(true)
    booksApi.getSellerBooks(seller.id, { page, size: 8 })
      .then(res => {
        const data = res.data.result || res.data.data || {}
        setBooks(data.content || [])
        setBooksMeta(data)
        setBooksPage(page)
      })
      .catch(console.error)
      .finally(() => setBooksLoading(false))
  }

  useEffect(() => { fetchBooks(0) }, [seller.id])

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />

      <div className="w-full max-w-xl bg-white h-full flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className={`px-6 py-5 flex items-start justify-between border-b ${active ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl
              ${active ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-200 text-gray-400'}`}>
              {(seller.fullName || seller.username || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{seller.fullName || seller.username}</h2>
              <p className="text-sm text-gray-500">@{seller.username}</p>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full
                ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                {active ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(seller)}
              title="Chỉnh sửa"
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Thông tin liên hệ */}
          <div className="px-6 py-5 border-b space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin liên hệ</h3>
            <div className="space-y-2 text-sm">
              {seller.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{seller.email}</span>
                </div>
              )}
              {seller.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{seller.phoneNumber}</span>
                </div>
              )}
              {seller.address && (
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{seller.address}</span>
                </div>
              )}
              {!seller.email && !seller.phoneNumber && !seller.address && (
                <p className="text-gray-400 italic text-sm">Chưa có thông tin liên hệ</p>
              )}
            </div>
          </div>

          {/* Thống kê */}
          <div className="px-6 py-5 border-b">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Thống kê sản phẩm</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-indigo-700">{booksMeta?.totalElements ?? '—'}</p>
                <p className="text-xs text-indigo-500 mt-0.5">Tổng sản phẩm</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  {booksLoading ? '—' : books.filter(b => b.status === 'ACTIVE').length}
                </p>
                <p className="text-xs text-emerald-500 mt-0.5">Đang bán (trang này)</p>
              </div>
            </div>
          </div>

          {/* Danh sách sách */}
          <div className="px-6 py-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Sản phẩm
              {booksMeta && <span className="ml-1 text-gray-400 font-normal normal-case">({booksMeta.totalElements})</span>}
            </h3>

            {booksLoading ? (
              <div className="py-10 text-center text-sm text-gray-400">Đang tải...</div>
            ) : books.length === 0 ? (
              <div className="py-10 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">Shop chưa có sản phẩm nào.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {books.map(book => (
                  <div key={book.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title}
                        className="w-10 h-14 object-cover rounded-lg shrink-0 bg-gray-100" />
                    ) : (
                      <div className="w-10 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 truncate">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-indigo-600">
                          {fmt(book.discountPrice || book.price)}
                        </span>
                        {book.discountPrice && (
                          <span className="text-xs text-gray-400 line-through">{fmt(book.price)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Package className="h-3 w-3" />
                        <span>{book.stockQuantity ?? 0}</span>
                      </div>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                        ${book.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {book.status === 'ACTIVE' ? 'Đang bán' : 'Ẩn'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {booksMeta && booksMeta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  disabled={booksPage === 0}
                  onClick={() => fetchBooks(booksPage - 1)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Trang {booksPage + 1} / {booksMeta.totalPages}
                </span>
                <button
                  disabled={booksMeta.last}
                  onClick={() => fetchBooks(booksPage + 1)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={() => onDelete(seller)}
            disabled={!active || lockingId === seller.id}
            title={active ? 'Xóa shop' : 'Shop đã không hoạt động'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors
              bg-red-50 border border-red-200 text-red-600 hover:bg-red-100
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {lockingId === seller.id
              ? 'Đang xử lý...'
              : <><Trash2 className="h-4 w-4" /> Xóa shop</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Trang chính ─── */
export default function ManageSellers() {
  const [sellers, setSellers]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [lockingId, setLockingId] = useState(null)
  const [selected, setSelected]   = useState(null)
  const [modalData, setModalData] = useState(null) // null = closed, false = create, object = edit
  const fetchSellers = () =>
    usersApi.getAll()
      .then(res => {
        const all = res.data.data || res.data.result || []
        setSellers(all.filter(u => u.role === 'SELLER'))
      })
      .catch(console.error)
      .finally(() => setLoading(false))

  useEffect(() => { fetchSellers() }, [])

  /* Soft delete — chỉ set isActive = false */
  const softDelete = async (u) => {
    if (!window.confirm(`Xóa shop "${u.fullName || u.username}"? Shop sẽ không còn hoạt động.`)) return
    setLockingId(u.id)
    try {
      await usersApi.update(u.id, {
        username:    u.username,
        email:       u.email,
        fullName:    u.fullName    || '',
        phoneNumber: u.phoneNumber || '',
        address:     u.address     || '',
        role:        'SELLER',
        isActive:    false,
        active:      false,
      })
      toast.success(`Đã xóa shop "${u.fullName || u.username}"!`)
      fetchSellers()
      if (selected?.id === u.id)
        setSelected(prev => ({ ...prev, isActive: false, active: false }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLockingId(null)
    }
  }

  /* After save (create or edit) */
  const handleSaved = () => {
    fetchSellers()
    if (modalData && modalData.id && selected?.id === modalData.id) {
      setSelected(null)
    }
  }

  const filtered = sellers.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bán hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sellers.length} shop trong hệ thống</p>
        </div>
        <button
          onClick={() => setModalData(false)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Thêm shop
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm tên shop, username, email..."
          className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card py-20 text-center text-gray-400">
          <Store className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p>{search ? 'Không tìm thấy shop nào.' : 'Chưa có shop nào.'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(u => {
            const active = getActive(u)
            return (
              <div key={u.id}
                className={`card p-5 flex flex-col gap-3 border-2 transition-all
                  ${active ? 'border-gray-100 hover:border-indigo-200' : 'border-red-100 bg-red-50/30 hover:border-red-300'}`}>

                {/* Avatar + tên */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg
                    ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {(u.fullName || u.username || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{u.fullName || u.username}</p>
                    <p className="text-xs text-gray-400 truncate">@{u.username}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0
                    ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  {u.email      && <p className="truncate">✉ {u.email}</p>}
                  {u.phoneNumber && <p>📞 {u.phoneNumber}</p>}
                  {u.address    && <p className="truncate">📍 {u.address}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-1">
                  <button
                    onClick={() => setSelected(u)}
                    className="flex-1 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 text-xs font-medium hover:bg-indigo-50 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => setModalData(u)}
                    title="Chỉnh sửa"
                    className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => softDelete(u)}
                    disabled={!active || lockingId === u.id}
                    title={active ? 'Xóa shop' : 'Shop đã không hoạt động'}
                    className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50
                      transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <SellerPanel
          seller={selected}
          onClose={() => setSelected(null)}
          onDelete={softDelete}
          lockingId={lockingId}
          onEdit={u => { setModalData(u); setSelected(null) }}
        />
      )}

      {/* Create / Edit modal */}
      {modalData !== null && (
        <SellerFormModal
          editData={modalData || null}
          onClose={() => setModalData(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
