import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { BookCard } from '../components/ui/BookCard'
import { Pagination } from '../components/ui/Pagination'
import { PageSpinner } from '../components/ui/Spinner'
import type { BookSummary, CategoryResponse } from '../types'

const PAGE_SIZE = 12

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  const page = Number(searchParams.get('page') || '0')

  const [books, setBooks] = useState<BookSummary[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    categoriesApi.getAll().then((res) => setCategories(res.data.result.filter((c) => c.active)))
  }, [])

  const fetchBooks = useCallback(() => {
    setLoading(true)
    const params = { page, size: PAGE_SIZE, categoryId, minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined }
    const req = keyword
      ? booksApi.search({ keyword, page, size: PAGE_SIZE })
      : booksApi.getAll(params)
    req.then((res) => {
      setBooks(res.data.result.content)
      setTotalPages(res.data.result.totalPages)
      setTotalElements(res.data.result.totalElements)
    }).finally(() => setLoading(false))
  }, [keyword, categoryId, page, minPrice, maxPrice])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const setPage = (p: number) => {
    setSearchParams((prev) => { prev.set('page', String(p)); return prev })
  }

  const setCategory = (id?: number) => {
    setSearchParams((prev) => {
      prev.delete('page')
      prev.delete('q')
      if (id) prev.set('categoryId', String(id))
      else prev.delete('categoryId')
      return prev
    })
  }

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice('')
    setSearchParams({})
  }

  const activeCategoryName = categories.find((c) => c.id === categoryId)?.name
  const hasActiveFilters = !!(keyword || categoryId || minPrice || maxPrice)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {keyword ? `Kết quả cho "${keyword}"` : activeCategoryName || 'Tất cả sách'}
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">{totalElements} đầu sách</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 space-y-4">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !categoryId
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 bg-white'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                categoryId === cat.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 bg-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Price range + clear */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Giá:</span>
          <input
            type="number"
            placeholder="Từ (VND)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input text-sm w-36"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="number"
            placeholder="Đến (VND)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input text-sm w-36"
          />
          <button onClick={fetchBooks} className="btn-primary text-sm py-1.5 px-4">
            Áp dụng
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Book grid */}
      {loading ? (
        <PageSpinner />
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Không tìm thấy sách nào</p>
          <button onClick={clearFilters} className="text-sm underline">Xóa bộ lọc</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  )
}
