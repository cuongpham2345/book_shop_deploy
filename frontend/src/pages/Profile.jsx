import { useEffect, useState } from 'react'
import { User, Mail, Phone, MapPin, Save, Edit2, Clock, CheckCircle, XCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/ui/Spinner'

const STATUS_META = {
  PENDING:  { label: 'Đang chờ duyệt', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  APPROVED: { label: 'Đã duyệt',       color: 'bg-green-50  text-green-700  border-green-200',  icon: CheckCircle },
  REJECTED: { label: 'Bị từ chối',     color: 'bg-red-50    text-red-600    border-red-200',    icon: XCircle },
}

export default function Profile() {
  const { hasRole } = useAuth()
  const isSeller = hasRole('SELLER')

  const [profile,       setProfile]       = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [editing,       setEditing]       = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [form,          setForm]          = useState({ fullName: '', phoneNumber: '', address: '', avatarUrl: '' })
  const [pendingReq,    setPendingReq]    = useState(null)
  const [loadingReq,    setLoadingReq]    = useState(false)

  const loadProfile = () =>
    api.get('/api/me').then(res => {
      const data = res.data.result
      setProfile(data)
      setForm({
        fullName:    data.fullName    || '',
        phoneNumber: data.phoneNumber || '',
        address:     data.address     || '',
        avatarUrl:   data.avatarUrl   || '',
      })
    })

  const loadPendingReq = () =>
    api.get('/api/me/update-request').then(res => setPendingReq(res.data.result || null))

  useEffect(() => {
    Promise.all([
      loadProfile(),
      isSeller ? loadPendingReq() : Promise.resolve(),
    ])
      .catch(() => toast.error('Không thể tải thông tin'))
      .finally(() => setLoading(false))
  }, [isSeller])

  // Admin/User: lưu trực tiếp
  const handleSaveDirect = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/api/me', form)
      setProfile(res.data.result)
      setEditing(false)
      toast.success('Cập nhật thông tin thành công!')
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  // Seller: gửi yêu cầu
  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/api/me/update-request', form)
      toast.success('Đã gửi yêu cầu, vui lòng chờ admin duyệt!')
      setEditing(false)
      setLoadingReq(true)
      await loadPendingReq()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại')
    } finally {
      setSaving(false)
      setLoadingReq(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const handleSave = isSeller ? handleSubmitRequest : handleSaveDirect

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-8 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30">
            {profile?.avatarUrl
              ? <img src={profile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover"
                  onError={e => { e.target.style.display = 'none' }} />
              : <User className="h-9 w-9 text-white" />
            }
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{profile?.fullName || profile?.username}</p>
            <span className="text-xs text-indigo-100 bg-white/20 px-2.5 py-0.5 rounded-full mt-1 inline-block">
              {profile?.role === 'ADMIN' ? 'Quản trị viên' : profile?.role === 'SELLER' ? 'Người bán' : 'Người dùng'}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Seller: hiện trạng thái yêu cầu đang chờ */}
          {isSeller && pendingReq && !editing && (
            <div className={`mb-4 flex items-start gap-2 border rounded-xl px-4 py-3 text-sm ${STATUS_META[pendingReq.status]?.color}`}>
              {(() => { const Icon = STATUS_META[pendingReq.status]?.icon; return <Icon className="h-4 w-4 mt-0.5 shrink-0" /> })()}
              <div>
                <p className="font-semibold">{STATUS_META[pendingReq.status]?.label}</p>
                <p className="text-xs mt-0.5 opacity-80">
                  {pendingReq.status === 'PENDING'
                    ? 'Yêu cầu chỉnh sửa thông tin của bạn đang chờ admin xét duyệt.'
                    : pendingReq.status === 'APPROVED'
                      ? 'Thông tin đã được cập nhật.'
                      : `Bị từ chối${pendingReq.adminNote ? ': ' + pendingReq.adminNote : '.'}`}
                </p>
              </div>
            </div>
          )}

          {!editing ? (
            /* View mode */
            <div className="space-y-4">
              <InfoRow icon={<User className="h-4 w-4" />}   label="Tên đăng nhập" value={profile?.username} />
              <InfoRow icon={<Mail className="h-4 w-4" />}   label="Email"         value={profile?.email} />
              <InfoRow icon={<User className="h-4 w-4" />}   label="Họ và tên"     value={profile?.fullName}    empty="Chưa cập nhật" />
              <InfoRow icon={<Phone className="h-4 w-4" />}  label="Số điện thoại" value={profile?.phoneNumber}  empty="Chưa cập nhật" />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Địa chỉ"       value={profile?.address}      empty="Chưa cập nhật" />

              {/* Seller chỉ cho chỉnh sửa khi không có yêu cầu PENDING */}
              {(!isSeller || pendingReq?.status !== 'PENDING') && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-medium transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  {isSeller ? 'Gửi yêu cầu chỉnh sửa' : 'Chỉnh sửa thông tin'}
                </button>
              )}
              {isSeller && pendingReq?.status === 'PENDING' && (
                <p className="text-center text-xs text-gray-400 mt-2">Đang có yêu cầu chờ duyệt, không thể gửi thêm.</p>
              )}
            </div>
          ) : (
            /* Edit mode */
            <form onSubmit={handleSave} className="space-y-4">
              {isSeller && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <Send className="h-4 w-4 shrink-0" />
                  <span>Thông tin sẽ được gửi để admin xét duyệt trước khi áp dụng.</span>
                </div>
              )}
              <Field label="Họ và tên"         value={form.fullName}    onChange={set('fullName')}    placeholder="Nhập họ và tên..." />
              <Field label="Số điện thoại"      value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="Nhập số điện thoại..." />
              <Field label="Địa chỉ"            value={form.address}     onChange={set('address')}     placeholder="Nhập địa chỉ..." />
              <Field label="URL ảnh đại diện"   value={form.avatarUrl}   onChange={set('avatarUrl')}   placeholder="https://..." />

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {isSeller
                    ? <><Send className="h-4 w-4" /> {saving ? 'Đang gửi...' : 'Gửi yêu cầu'}</>
                    : <><Save className="h-4 w-4" /> {saving ? 'Đang lưu...'  : 'Lưu thay đổi'}</>
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, empty = '' }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-indigo-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${value ? 'text-gray-900' : 'text-gray-300 italic'}`}>
          {value || empty}
        </p>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
    </div>
  )
}
