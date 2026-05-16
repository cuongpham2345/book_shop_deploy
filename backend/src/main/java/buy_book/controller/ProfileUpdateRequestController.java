package buy_book.controller;

import buy_book.constant.NotificationType;
import buy_book.constant.RequestStatus;
import buy_book.constant.Role;
import buy_book.dto.response.ApiResponse;
import buy_book.entity.ProfileUpdateRequest;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.ProfileUpdateRequestRepository;
import buy_book.repository.UserRepository;
import buy_book.service.NotificationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileUpdateRequestController {

    private final ProfileUpdateRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ── SELLER: gửi yêu cầu chỉnh sửa ──────────────────────────

    @PostMapping("/api/me/update-request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitRequest(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody SubmitRequest body) {

        String username = jwt.getSubject();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (seller.getRole() != buy_book.constant.Role.SELLER) {
            throw new RuntimeException("Chỉ tài khoản Seller mới được gửi yêu cầu chỉnh sửa thông tin");
        }

        // Huỷ yêu cầu PENDING cũ nếu có
        requestRepository.findBySellerIdAndStatus(seller.getId(), RequestStatus.PENDING)
                .ifPresent(old -> {
                    old.setStatus(RequestStatus.REJECTED);
                    old.setAdminNote("Tự động huỷ do có yêu cầu mới");
                    requestRepository.save(old);
                });

        ProfileUpdateRequest req = ProfileUpdateRequest.builder()
                .seller(seller)
                .fullName(body.getFullName())
                .phoneNumber(body.getPhoneNumber())
                .address(body.getAddress())
                .avatarUrl(body.getAvatarUrl())
                .status(RequestStatus.PENDING)
                .build();
        requestRepository.save(req);

        // Thông báo cho tất cả admin
        userRepository.findByRole(Role.ADMIN).forEach(admin ->
                notificationService.create(admin,
                        "Yêu cầu chỉnh sửa thông tin",
                        "Seller " + (seller.getFullName() != null ? seller.getFullName() : seller.getUsername())
                                + " đã gửi yêu cầu cập nhật thông tin cá nhân.",
                        NotificationType.SYSTEM, null, null));

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .code(200)
                .message("Yêu cầu đã được gửi, vui lòng chờ admin duyệt")
                .result(Map.of("requestId", req.getId()))
                .build());
    }

    // ── SELLER: xem trạng thái yêu cầu của mình ─────────────────

    @GetMapping("/api/me/update-request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyRequest(
            @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return requestRepository.findTopBySellerIdOrderByCreatedAtDesc(seller.getId())
                .map(req -> ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                        .code(200)
                        .result(toMap(req))
                        .build()))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                        .code(200)
                        .result(null)
                        .build()));
    }

    // ── ADMIN: xem tất cả yêu cầu ───────────────────────────────

    @GetMapping("/api/admin/profile-requests")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllRequests(
            @RequestParam(required = false) RequestStatus status) {

        List<ProfileUpdateRequest> list = status != null
                ? requestRepository.findByStatusOrderByCreatedAtDesc(status)
                : requestRepository.findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> result = list.stream().map(this::toMap).toList();
        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .code(200)
                .result(result)
                .build());
    }

    // ── ADMIN: duyệt yêu cầu ────────────────────────────────────

    @PostMapping("/api/admin/profile-requests/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approve(
            @PathVariable Long id,
            @RequestBody(required = false) NoteBody body) {

        ProfileUpdateRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        if (req.getStatus() != RequestStatus.PENDING)
            throw new RuntimeException("Yêu cầu này đã được xử lý");

        User seller = req.getSeller();
        if (req.getFullName()    != null) seller.setFullName(req.getFullName());
        if (req.getPhoneNumber() != null) seller.setPhoneNumber(req.getPhoneNumber());
        if (req.getAddress()     != null) seller.setAddress(req.getAddress());
        if (req.getAvatarUrl()   != null) seller.setAvatarUrl(req.getAvatarUrl());
        userRepository.save(seller);

        req.setStatus(RequestStatus.APPROVED);
        if (body != null && body.getNote() != null) req.setAdminNote(body.getNote());
        requestRepository.save(req);

        notificationService.create(seller,
                "Yêu cầu được duyệt",
                "Thông tin cá nhân của bạn đã được admin cập nhật thành công."
                        + (body != null && body.getNote() != null ? " Ghi chú: " + body.getNote() : ""),
                NotificationType.SYSTEM, null, null);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200).message("Đã duyệt và cập nhật thông tin").build());
    }

    // ── ADMIN: từ chối yêu cầu ──────────────────────────────────

    @PostMapping("/api/admin/profile-requests/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> reject(
            @PathVariable Long id,
            @RequestBody(required = false) NoteBody body) {

        ProfileUpdateRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        if (req.getStatus() != RequestStatus.PENDING)
            throw new RuntimeException("Yêu cầu này đã được xử lý");

        req.setStatus(RequestStatus.REJECTED);
        if (body != null && body.getNote() != null) req.setAdminNote(body.getNote());
        requestRepository.save(req);

        notificationService.create(req.getSeller(),
                "Yêu cầu bị từ chối",
                "Yêu cầu cập nhật thông tin cá nhân của bạn đã bị từ chối."
                        + (body != null && body.getNote() != null ? " Lý do: " + body.getNote() : ""),
                NotificationType.SYSTEM, null, null);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200).message("Đã từ chối yêu cầu").build());
    }

    // ── helpers ──────────────────────────────────────────────────

    private Map<String, Object> toMap(ProfileUpdateRequest req) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",          req.getId());
        m.put("status",      req.getStatus().name());
        m.put("sellerId",    req.getSeller().getId());
        m.put("sellerUsername", req.getSeller().getUsername());
        m.put("sellerName",  req.getSeller().getFullName() != null ? req.getSeller().getFullName() : req.getSeller().getUsername());
        m.put("fullName",    req.getFullName());
        m.put("phoneNumber", req.getPhoneNumber());
        m.put("address",     req.getAddress());
        m.put("avatarUrl",   req.getAvatarUrl());
        m.put("adminNote",   req.getAdminNote());
        m.put("createdAt",   req.getCreatedAt());
        return m;
    }

    @Getter @Setter
    public static class SubmitRequest {
        private String fullName;
        private String phoneNumber;
        private String address;
        private String avatarUrl;
    }

    @Getter @Setter
    public static class NoteBody {
        private String note;
    }
}
