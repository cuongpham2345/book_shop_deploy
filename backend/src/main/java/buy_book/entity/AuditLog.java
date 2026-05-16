package buy_book.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_username", nullable = false, length = 50)
    private String adminUsername;

    @Column(name = "admin_full_name", length = 100)
    private String adminFullName;

    @Column(nullable = false, length = 20)
    private String action; // CREATE, UPDATE, DELETE, LOCK, UNLOCK

    @Column(name = "entity_type", nullable = false, length = 20)
    private String entityType; // USER, SELLER, CATEGORY, BOOK

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_name", length = 200)
    private String entityName;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
