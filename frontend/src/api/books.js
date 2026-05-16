import api from './axios'

export const booksApi = {
  getAll: (params) =>
    api.get('/api/books', { params }),

  filter: (params) =>
    api.get('/api/books/filter', { params }),

  getById: (id) =>
    api.get(`/api/books/${id}`),

  search: (params) =>
    api.get('/api/books/search', { params }),

  getByCategory: (categoryId, params) =>
    api.get(`/api/books/category/${categoryId}`, { params }),

  getMyBooks: () =>
    api.get('/api/seller/books'),

  createBook: (data) =>
    api.post('/api/seller/books', data),

  updateBook: (id, data) =>
    api.put(`/api/seller/books/${id}`, data),

  deleteBook: (id) =>
    api.delete(`/api/seller/books/${id}`),

  getSellerBooks: (sellerId, params) =>
    api.get(`/api/admin/sellers/${sellerId}/books`, { params }),
}
