package buy_book.service;

import buy_book.dto.request.BookRequest;
import buy_book.dto.response.BookDetailResponse;
import buy_book.dto.response.BookSummaryResponse;
import buy_book.dto.response.PageResponse;

import java.math.BigDecimal;
import java.util.List;

public interface BookService {

    PageResponse<BookSummaryResponse> getAllBooks(int page, int size, String sortBy);
    PageResponse<BookSummaryResponse> searchBooks(String keyword, int page, int size);
    PageResponse<BookSummaryResponse> getBooksByCategory(Long categoryId, int page, int size);
    PageResponse<BookSummaryResponse> filterBooks(
            String title, String author, Integer publishYear,
            BigDecimal minPrice, BigDecimal maxPrice,
            Long categoryId, Boolean hasDiscount, String sortBy, int page, int size,
            String sellerName);
    BookDetailResponse getBookDetail(Long id);

    PageResponse<BookSummaryResponse> getBooksBySeller(Long sellerId, int page, int size);

    BookDetailResponse getBookDetailAdmin(Long id);

    // Thêm mới
    BookDetailResponse createBook(BookRequest request, String username);
    BookDetailResponse updateBook(Long id, BookRequest request, String username);
    void deleteBook(Long id, String username);

    List<BookDetailResponse> getMyBooks(String username);
}