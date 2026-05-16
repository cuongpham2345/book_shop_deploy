package buy_book.controller;

import buy_book.constant.NotificationType;
import buy_book.dto.request.UserRequest;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.UserResponse;
import buy_book.entity.User;
import buy_book.repository.UserRepository;
import buy_book.service.AuditLogService;
import buy_book.service.NotificationService;
import buy_book.service.UserService;
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
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .code(200)
                .result(userService.getAllUsers())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .code(200)
                .result(userService.getUserById(id))
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserRequest request,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        UserResponse created = userService.createUser(request);
        String admin = jwt != null ? jwt.getSubject() : "system";
        String entityType = isSellerRole(created) ? "SELLER" : "USER";

        auditLogService.log(admin, "CREATE", entityType,
                created.getId(), created.getUsername(),
                "Tạo tài khoản mới",
                null,
                toJson(userMap(created)),
                getClientIp(httpRequest));

        notifyAdmin(admin, "Tạo tài khoản",
                "Bạn đã tạo tài khoản: " + created.getUsername() + " (" + entityType + ")");

        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Thêm tài khoản thành công")
                .result(created)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        UserResponse old = userService.getUserById(id);
        UserResponse updated = userService.updateUser(id, request);
        String admin = jwt != null ? jwt.getSubject() : "system";
        String entityType = isSellerRole(updated) ? "SELLER" : "USER";

        auditLogService.log(admin, "UPDATE", entityType,
                updated.getId(), updated.getUsername(),
                "Cập nhật thông tin",
                toJson(userMap(old)),
                toJson(userMap(updated)),
                getClientIp(httpRequest));

        notifyAdmin(admin, "Cập nhật tài khoản",
                "Bạn đã cập nhật tài khoản: " + updated.getUsername() + " (" + entityType + ")");

        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Cập nhật tài khoản thành công")
                .result(updated)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest httpRequest) {

        UserResponse user = userService.getUserById(id);
        userService.deleteUser(id);
        String admin = jwt != null ? jwt.getSubject() : "system";
        String entityType = isSellerRole(user) ? "SELLER" : "USER";

        auditLogService.log(admin, "DELETE", entityType,
                user.getId(), user.getUsername(),
                "Xóa tài khoản",
                toJson(userMap(user)),
                null,
                getClientIp(httpRequest));

        notifyAdmin(admin, "Xóa tài khoản",
                "Bạn đã xóa tài khoản: " + user.getUsername() + " (" + entityType + ")");

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa tài khoản thành công")
                .build());
    }

    // ── helpers ──────────────────────────────────────────────

    private void notifyAdmin(String adminUsername, String title, String message) {
        userRepository.findByUsername(adminUsername).ifPresent(admin ->
                notificationService.create(admin, title, message, NotificationType.SYSTEM, null, null));
    }

    private boolean isSellerRole(UserResponse u) {
        return u.getRole() != null && "SELLER".equals(u.getRole().name());
    }

    private Map<String, Object> userMap(UserResponse u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("username",    nvl(u.getUsername()));
        m.put("email",       nvl(u.getEmail()));
        m.put("fullName",    nvl(u.getFullName()));
        m.put("phoneNumber", nvl(u.getPhoneNumber()));
        m.put("address",     nvl(u.getAddress()));
        m.put("role",        u.getRole() != null ? u.getRole().name() : "");
        m.put("isActive",    u.isActive());
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
