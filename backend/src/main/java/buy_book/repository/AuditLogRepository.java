package buy_book.repository;

import buy_book.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:action     IS NULL OR a.action     = :action)     AND " +
           "(:fromDate   IS NULL OR a.createdAt >= :fromDate)   AND " +
           "(:toDate     IS NULL OR a.createdAt <= :toDate)     " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findWithFilters(
            @Param("entityType") String entityType,
            @Param("action")     String action,
            @Param("fromDate")   LocalDateTime fromDate,
            @Param("toDate")     LocalDateTime toDate,
            Pageable pageable);
}
