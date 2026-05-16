package buy_book.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuditLogResponse {
    Long id;
    String adminUsername;
    String adminFullName;
    String action;
    String entityType;
    Long entityId;
    String entityName;
    String detail;
    String oldValue;
    String newValue;
    String ipAddress;
    LocalDateTime createdAt;
}
