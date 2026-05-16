package buy_book.controller;

import buy_book.constant.NotificationType;
import buy_book.dto.request.CategoryRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.CategoryResponse;
import buy_book.repository.UserRepository;
import buy_book.service.AuditLogService;
import buy_book.service.CategoryService;
import buy_book.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @GetMapping("/api/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.<List<CategoryResponse>>builder()
                .code(200)
                .result(categoryService.getAllCategories())
                .build());
    }

    @GetMapping("/api/admin/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategoriesAdmin() {
        return ResponseEntity.ok(ApiResponse.<List<CategoryResponse>>builder()
                .code(200)
                .result(categoryService.getAllCategoriesAdmin())
                .build());
    }

    @GetMapping("/api/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .code(200)
                .result(categoryService.getCategoryById(id))
                .build());
    }

    @PostMapping("/api/admin/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        CategoryResponse created = categoryService.createCategory(request);
        String admin = jwt != null ? jwt.getSubject() : "system";

        auditLogService.log(admin, "CREATE", "CATEGORY",
                created.getId(), created.getName(),
                "Tạo danh mục mới",
                null,
                toJson(catMap(created)),
                getClientIp(httpRequest));

        notifyAdmin(admin, "Tạo danh mục",
                "Bạn đã tạo danh mục: " + created.getName());

        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .code(200)
                .message("Thêm danh mục thành công")
                .result(created)
                .build());
    }

    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        CategoryResponse old = categoryService.getCategoryById(id);
        CategoryResponse updated = categoryService.updateCategory(id, request);
        String admin = jwt != null ? jwt.getSubject() : "system";

        auditLogService.log(admin, "UPDATE", "CATEGORY",
                updated.getId(), updated.getName(),
                "Cập nhật danh mục",
                toJson(catMap(old)),
                toJson(catMap(updated)),
                getClientIp(httpRequest));

        notifyAdmin(admin, "Cập nhật danh mục",
                "Bạn đã cập nhật danh mục: " + updated.getName());

        return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder()
                .code(200)
                .message("Cập nhật danh mục thành công")
                .result(updated)
                .build());
    }

    @DeleteMapping("/api/admin/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        CategoryResponse cat = categoryService.getCategoryById(id);
        categoryService.deleteCategory(id);
        String admin = jwt != null ? jwt.getSubject() : "system";

        auditLogService.log(admin, "DELETE", "CATEGORY",
                cat.getId(), cat.getName(),
                "Xóa danh mục",
                toJson(catMap(cat)),
                null,
                getClientIp(httpRequest));

        notifyAdmin(admin, "Xóa danh mục",
                "Bạn đã xóa danh mục: " + cat.getName());

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa danh mục thành công")
                .build());
    }

    // ── helpers ──────────────────────────────────────────────

    private void notifyAdmin(String adminUsername, String title, String message) {
        userRepository.findByUsername(adminUsername).ifPresent(admin ->
                notificationService.create(admin, title, message, NotificationType.SYSTEM, null, null));
    }

    private Map<String, Object> catMap(CategoryResponse c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("name",        nvl(c.getName()));
        m.put("description", nvl(c.getDescription()));
        m.put("imageUrl",    nvl(c.getImageUrl()));
        m.put("slug",        nvl(c.getSlug()));
        m.put("active",      c.isActive());
        return m;
    }

    private String nvl(String s) { return s != null ? s : ""; }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return "{}"; }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) return request.getRemoteAddr();
        return ip.split(",")[0].trim();
    }
}
