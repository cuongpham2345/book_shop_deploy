package buy_book.controller;

import buy_book.constant.Role;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.UserResponse;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .code(200)
                .result(toResponse(user))
                .build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ProfileUpdateRequest request) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getRole() == Role.SELLER) {
            throw new RuntimeException("Seller phải gửi yêu cầu chỉnh sửa để admin duyệt. Sử dụng POST /api/me/update-request");
        }

        if (request.getFullName() != null)    user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null)     user.setAddress(request.getAddress());
        if (request.getAvatarUrl() != null)   user.setAvatarUrl(request.getAvatarUrl());

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Cập nhật thông tin thành công")
                .result(toResponse(user))
                .build());
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phoneNumber(u.getPhoneNumber())
                .address(u.getAddress())
                .avatarUrl(u.getAvatarUrl())
                .role(u.getRole())
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
                .build();
    }

    @lombok.Getter
    @lombok.Setter
    public static class ProfileUpdateRequest {
        private String fullName;
        private String phoneNumber;
        private String address;
        private String avatarUrl;
    }
}
