package buy_book.service;

import buy_book.dto.response.AuditLogResponse;
import buy_book.dto.response.PageResponse;

import java.time.LocalDateTime;

public interface AuditLogService {

    void log(String adminUsername, String action, String entityType,
             Long entityId, String entityName, String detail,
             String oldValue, String newValue, String ipAddress);

    PageResponse<AuditLogResponse> getLogs(String entityType, String action,
                                           LocalDateTime fromDate, LocalDateTime toDate,
                                           int page, int size);
}
