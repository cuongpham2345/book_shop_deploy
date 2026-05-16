import { useEffect, useState } from 'react'
import {
  History, ChevronLeft, ChevronRight,
  ShieldCheck, Search, RotateCcw, ArrowLeftRight, X,
} from 'lucide-react'
import { auditApi } from '../../api/audit'
import { PageSpinner } from '../../components/ui/Spinner'

/* ── constants ─────────────────────────────────────────────── */

const ACTION_STYLE = {
  CREATE: { label: 'Tạo mới',  cls: 'bg-emerald-100 text-emerald-700' },
  UPDATE: { label: 'Cập nhật', cls: 'bg-blue-100   text-blue-700'    },
  DELETE: { label: 'Xóa',      cls: 'bg-red-100    text-red-600'     },
}

const ENTITY_META = {
  USER:     { label: 'Tài khoản', cls: 'bg-gray-100  text-gray-600',  section: 'Quản lý tài khoản' },
  SELLER:   { label: 'Shop',      cls: 'bg-blue-50   text-blue-600',  section: 'Quản lý bán hàng'  },
  CATEGORY: { label: 'Danh mục', cls: 'bg-amber-50  text-amber-600', section: 'Quản lý danh mục'  },
  BOOK:     { label: 'Sản phẩm', cls: 'bg-rose-50   text-rose-600',  section: 'Quản lý sản phẩm'  },
}

const FIELD_LABELS = {
  username: 'Username', email: 'Email', fullName: 'Họ tên',
  phoneNumber: 'Điện thoại', address: 'Địa chỉ', role: 'Vai trò', isActive: 'Kích hoạt', active: 'Kích hoạt',
  name: 'Tên', description: 'Mô tả', imageUrl: 'URL ảnh', slug: 'Slug',
  title: 'Tên sách', author: 'Tác giả', publisher: 'NXB',
  price: 'Giá gốc', discountPrice: 'Giá KM', stockQuantity: 'Tồn kho',
  category: 'Danh mục', status: 'Trạng thái',
}

const ENTITY_OPTS = [
  { value: '',         label: 'Tất cả đối tượng' },
  { value: 'USER',     label: 'Tài khoản' },
  { value: 'SELLER',   label: 'Bán hàng'  },
  { value: 'CATEGORY', label: 'Danh mục'  },
  { value: 'BOOK',     label: 'Sản phẩm'  },
]

const ACTION_OPTS = [
  { value: '',       label: 'Tất cả hành động' },
  { value: 'CREATE', label: 'Tạo mới'  },
  { value: 'UPDATE', label: 'Cập nhật' },
  { value: 'DELETE', label: 'Xóa'      },
]

/* ── helpers ───────────────────────────────────────────────── */

const parseJson = (s) => { try { return s ? JSON.parse(s) : null } catch { return null } }

const fmtVal = (v) => {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Có' : 'Không'
  return String(v)
}

/* ── CompactValue: 3 field đầu, plain text, không tô màu ── */
function CompactValue({ data }) {
  if (!data) return <span className="text-xs text-gray-300 italic">—</span>
  const entries = Object.entries(data).slice(0, 3)
  return (
    <div className="space-y-0.5">
      {entries.map(([k, v]) => (
        <div key={k} className="text-xs text-gray-500 flex gap-1 leading-4">
          <span className="text-gray-400 shrink-0">{FIELD_LABELS[k] || k}:</span>
          <span className="truncate max-w-[90px]" title={fmtVal(v)}>{fmtVal(v)}</span>
        </div>
      ))}
      {Object.keys(data).length > 3 && (
        <span className="text-xs text-gray-400">+{Object.keys(data).length - 3} trường</span>
      )}
    </div>
  )
}

/* ── DiffModal: so sánh chi tiết khi bấm "Xem" ── */
function DiffModal({ log, onClose }) {
  const old = parseJson(log.oldValue)
  const nw  = parseJson(log.newValue)
  const allKeys    = [...new Set([...(old ? Object.keys(old) : []), ...(nw ? Object.keys(nw) : [])])]
  const changedKeys = (old && nw) ? allKeys.filter(k => fmtVal(old[k]) !== fmtVal(nw[k])) : []
  const actionMeta  = ACTION_STYLE[log.action] || { label: log.action, cls: 'bg-gray-100 text-gray-600' }
  const entityMeta  = ENTITY_META[log.entityType] || { label: log.entityType, cls: 'bg-gray-100 text-gray-600' }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowLeftRight className="h-5 w-5 text-indigo-500 shrink-0" />
            <span className="font-bold text-gray-900">So sánh thay đổi</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${actionMeta.cls}`}>
              {actionMeta.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${entityMeta.cls}`}>
              {entityMeta.label}
            </span>
            <span className="text-sm text-gray-500">— {log.entityName}</span>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-2 shrink-0">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 p-6">
          {allKeys.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">Không có dữ liệu để so sánh</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100">
                  <th className="pb-3 text-left text-gray-400 pr-4 w-[24%]">Trường</th>
                  <th className="pb-3 text-left pr-4 w-[38%]">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                      Giá trị cũ
                    </span>
                  </th>
                  <th className="pb-3 text-left w-[38%]">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      Giá trị mới
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allKeys.map(k => {
                  const changed = changedKeys.includes(k)
                  return (
                    <tr key={k}
                      className={`border-b border-gray-50 ${changed ? 'bg-yellow-50/60' : ''}`}>
                      <td className="py-2 pr-4 text-xs font-semibold text-gray-500">
                        {FIELD_LABELS[k] || k}
                        {changed && <span className="ml-1 text-yellow-500 text-[10px]">●</span>}
                      </td>
                      <td className={`py-2 pr-4 text-xs ${changed ? 'text-red-600' : 'text-gray-500'}`}>
                        <span className={changed ? 'line-through' : ''}>{fmtVal(old?.[k])}</span>
                      </td>
                      <td className={`py-2 text-xs ${changed ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                        {fmtVal(nw?.[k])}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {changedKeys.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl">
            <p className="text-xs text-gray-500">
              <span className="text-yellow-600 font-semibold">{changedKeys.length}</span> trường thay đổi
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────── */

const toDateStr = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const defaultFilters = () => {
  const today = new Date()
  return {
    entityType: '',
    action: '',
    fromDate: toDateStr(new Date(today.getFullYear(), today.getMonth(), 1)),
    toDate:   toDateStr(today),
  }
}

export default function AdminAuditLog() {
  const [filters, setFilters]             = useState(defaultFilters)
  const [activeFilters, setActiveFilters] = useState(defaultFilters)
  const [logs, setLogs]                   = useState([])
  const [meta, setMeta]                   = useState(null)
  const [page, setPage]                   = useState(0)
  const [loading, setLoading]             = useState(true)
  const [diffLog, setDiffLog]             = useState(null)

  const fetchLogs = (f, p) => {
    setLoading(true)
    auditApi.getLogs({
      entityType: f.entityType || undefined,
      action:     f.action     || undefined,
      fromDate:   f.fromDate   || undefined,
      toDate:     f.toDate     || undefined,
      page: p, size: 20,
    })
      .then(res => {
        const data = res.data.result || {}
        setLogs(data.content || [])
        setMeta(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLogs(activeFilters, page) }, [activeFilters, page])

  const handleSearch = () => { setActiveFilters({ ...filters }); setPage(0) }
  const handleReset  = () => { const d = defaultFilters(); setFilters(d); setActiveFilters(d); setPage(0) }

  const inputCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 ' +
    'focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white'

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
          <History className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử thay đổi</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta ? `${meta.totalElements} bản ghi` : 'Đang tải...'}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card mb-5 p-4">
        <div className="flex gap-3 items-end w-full">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-medium text-gray-500">Từ ngày</label>
            <input type="date" value={filters.fromDate}
              onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
              className={`${inputCls} w-full`} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-medium text-gray-500">Đến ngày</label>
            <input type="date" value={filters.toDate}
              onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
              className={`${inputCls} w-full`} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-medium text-gray-500">Đối tượng</label>
            <select value={filters.entityType}
              onChange={e => setFilters(f => ({ ...f, entityType: e.target.value }))}
              className={`${inputCls} w-full`}>
              {ENTITY_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-medium text-gray-500">Hành động</label>
            <select value={filters.action}
              onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
              className={`${inputCls} w-full`}>
              {ACTION_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pb-0.5 shrink-0">
            <button onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg
                text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
              <Search className="h-4 w-4" /> Tìm kiếm
            </button>
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg
                text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
              <RotateCcw className="h-4 w-4" /> Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="py-16"><PageSpinner /></div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <History className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p>Chưa có lịch sử nào.</p>
          </div>
        ) : (
          <table className="w-full text-sm" style={{ minWidth: '1100px' }}>
            <thead className="border-b border-gray-100">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                <th className="px-3 py-3 text-center w-10">STT</th>
                <th className="px-3 py-3 whitespace-nowrap bg-red-50/60 text-red-400">Giá trị cũ</th>
                <th className="px-3 py-3 whitespace-nowrap bg-yellow-50 text-yellow-600 text-center">So sánh</th>
                <th className="px-3 py-3 whitespace-nowrap bg-emerald-50/60 text-emerald-500">Giá trị mới</th>
                <th className="px-3 py-3 whitespace-nowrap">Hành động</th>
                <th className="px-3 py-3 whitespace-nowrap">Chức năng</th>
                <th className="px-3 py-3 whitespace-nowrap">Người thực hiện</th>
                <th className="px-3 py-3 whitespace-nowrap">IP</th>
                <th className="px-3 py-3 whitespace-nowrap">Ngày thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log, idx) => {
                const old = parseJson(log.oldValue)
                const nw  = parseJson(log.newValue)
                const actionMeta = ACTION_STYLE[log.action]
                  || { label: log.action, cls: 'bg-gray-100 text-gray-600' }
                const entityMeta = ENTITY_META[log.entityType]
                  || { label: log.entityType, cls: 'bg-gray-100 text-gray-600', section: log.entityType }
                const rowNum = (meta?.pageNumber || 0) * 20 + idx + 1
                const d = log.createdAt ? new Date(log.createdAt) : null

                return (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors align-top">

                    {/* STT */}
                    <td className="px-3 py-3 text-xs text-gray-400 text-center">{rowNum}</td>

                    {/* Giá trị cũ */}
                    <td className="px-3 py-3 bg-red-50/10">
                      <CompactValue data={old} />
                    </td>

                    {/* So sánh */}
                    <td className="px-3 py-3 bg-yellow-50/10 text-center">
                      {log.action === 'UPDATE' ? (
                        <button onClick={() => setDiffLog(log)}
                          title="Xem so sánh chi tiết"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                            bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors
                            text-xs font-medium whitespace-nowrap">
                          <ArrowLeftRight className="h-3 w-3" /> Xem
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    {/* Giá trị mới */}
                    <td className="px-3 py-3 bg-emerald-50/10">
                      <CompactValue data={nw} />
                    </td>

                    {/* Hành động */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionMeta.cls}`}>
                        {actionMeta.label}
                      </span>
                    </td>

                    {/* Chức năng */}
                    <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {entityMeta.section}
                    </td>

                    {/* Người thực hiện */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                          {log.adminFullName || log.adminUsername}
                        </span>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-3 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">
                      {log.ipAddress || '—'}
                    </td>

                    {/* Ngày thực hiện */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      {d ? (
                        <div className="text-xs">
                          <div className="font-medium text-gray-700">{d.toLocaleDateString('vi-VN')}</div>
                          <div className="text-gray-400 font-mono">{d.toLocaleTimeString('vi-VN')}</div>
                        </div>
                      ) : '—'}
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200
              text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" /> Trước
          </button>
          <span className="text-sm text-gray-600">Trang {page + 1} / {meta.totalPages}</span>
          <button disabled={meta.last} onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200
              text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Sau <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Comparison modal */}
      {diffLog && <DiffModal log={diffLog} onClose={() => setDiffLog(null)} />}
    </div>
  )
}
