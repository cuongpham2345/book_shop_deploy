import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, User, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { PageSpinner } from '../../components/ui/Spinner'

const STATUS_META = {
  PENDING:  { label: 'Chờ duyệt',  color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  APPROVED: { label: 'Đã duyệt',   color: 'bg-green-50  text-green-700  border-green-200',  icon: CheckCircle },
  REJECTED: { label: 'Từ chối',    color: 'bg-red-50    text-red-600    border-red-200',    icon: XCircle },
}

function formatDate(s) {
  return new Date(s).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ManageProfileRequests() {
  const [requests,   setRequests]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('PENDING')
  const [rejectNote, setRejectNote] = useState({})   // lý do từ chối riêng theo từng request id
  const [acting,     setActing]     = useState(null)

  const load = (status = filter) => {
    setLoading(true)
    api.get('/api/admin/profile-requests', { params: { status } })
      .then(res => setRequests(res.data.result || []))
      .catch(() => toast.error('Không thể tải dữ liệu'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(filter) }, [filter])

  const handleApprove = async (id) => {
    setActing(id + '-approve')
    try {
      await api.post(`/api/admin/profile-requests/${id}/approve`, {})
      toast.success('Đã duyệt và cập nhật thông tin seller!')
      load(filter)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setActing(null)
    }
  }

  const handleReject = async (id) => {
    const note = rejectNote[id]?.trim()
    if (!note) { toast.error('Vui lòng nhập lý do từ chối'); return }
    setActing(id + '-reject')
    try {
      await api.post(`/api/admin/profile-requests/${id}/reject`, { note })
      toast.success('Đã từ chối yêu cầu!')
      load(filter)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setActing(null)
    }
  }

  const TABS = [
    { key: 'PENDING',  label: 'Chờ duyệt' },
    { key: 'APPROVED', label: 'Đã duyệt' },
    { key: 'REJECTED', label: 'Từ chối' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yêu cầu chỉnh sửa thông tin</h1>
          <p className="text-sm text-gray-500 mt-0.5">Duyệt hoặc từ chối yêu cầu cập nhật thông tin của seller</p>
        </div>
        <button onClick={() => load(filter)}
          className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-5">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab.key
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : requests.length === 0 ? (
        <div className="card py-16 text-center text-gray-400">
          <User className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p>Không có yêu cầu nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => {
            const meta = STATUS_META[req.status]
            const Icon = meta?.icon
            return (
              <div key={req.id} className="card p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{req.sellerName}</p>
                      <p className="text-xs text-gray-400">@{req.sellerUsername}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta?.color}`}>
                      <Icon className="h-3 w-3" /> {meta?.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(req.createdAt)}</span>
                  </div>
                </div>

                {/* Requested info */}
                <div className="grid sm:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
                  {[
                    { label: 'Họ và tên',     value: req.fullName },
                    { label: 'Số điện thoại', value: req.phoneNumber },
                    { label: 'Địa chỉ',       value: req.address },
                    { label: 'URL ảnh',       value: req.avatarUrl },
                  ].map(({ label, value }) => value ? (
                    <div key={label}>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5 break-all">{value}</p>
                    </div>
                  ) : null)}
                </div>

                {/* Lý do từ chối (view sau khi xử lý) */}
                {req.adminNote && req.status === 'REJECTED' && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-700"><span className="font-semibold">Lý do từ chối:</span> {req.adminNote}</p>
                  </div>
                )}

                {/* Actions (only for PENDING) */}
                {req.status === 'PENDING' && (
                  <div className="space-y-3">
                    {/* Ô nhập lý do từ chối */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Lý do từ chối <span className="text-red-500">*</span>
                        <span className="font-normal text-gray-400 ml-1">(bắt buộc nếu từ chối)</span>
                      </label>
                      <textarea
                        value={rejectNote[req.id] || ''}
                        onChange={e => setRejectNote(m => ({ ...m, [req.id]: e.target.value }))}
                        placeholder="Nhập lý do từ chối để thông báo cho seller..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={acting != null}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        {acting === req.id + '-reject' ? 'Đang xử lý...' : 'Từ chối'}
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={acting != null}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {acting === req.id + '-approve' ? 'Đang xử lý...' : 'Duyệt'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
