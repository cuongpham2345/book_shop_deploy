package buy_book.service.impl;

import buy_book.constant.NotificationType;
import buy_book.dto.response.NotificationResponse;
import buy_book.entity.Notification;
import buy_book.entity.User;
import buy_book.exception.AppException;
import buy_book.exception.ErrorCode;
import buy_book.repository.NotificationRepository;
import buy_book.repository.UserRepository;
import buy_book.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void create(User user, String title, String message, NotificationType type,
                       Long relatedOrderId, String relatedOrderCode) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedOrderId(relatedOrderId)
                .relatedOrderCode(relatedOrderCode)
                .build();
        notificationRepository.save(n);
    }

    @Override
    public List<NotificationResponse> getMyNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Override
    public long getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Override
    public void markAsRead(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        if (!n.getUser().getId().equals(user.getId()))
            throw new AppException(ErrorCode.UNAUTHORIZED);
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Override
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        notificationRepository.markAllAsReadByUserId(user.getId());
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .relatedOrderId(n.getRelatedOrderId())
                .relatedOrderCode(n.getRelatedOrderCode())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
