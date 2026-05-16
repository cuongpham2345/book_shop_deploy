import api from './axios'

export const auditApi = {
  getLogs: (params) => api.get('/api/admin/audit-logs', { params }),
}
