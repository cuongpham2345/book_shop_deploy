package buy_book.controller;

import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.AuditLogResponse;
import buy_book.dto.response.PageResponse;
import buy_book.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> getLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        LocalDateTime from = (fromDate != null && !fromDate.isBlank())
                ? LocalDate.parse(fromDate).atStartOfDay() : null;
        LocalDateTime to   = (toDate   != null && !toDate.isBlank())
                ? LocalDate.parse(toDate).atTime(23, 59, 59) : null;

        return ResponseEntity.ok(ApiResponse.<PageResponse<AuditLogResponse>>builder()
                .code(200)
                .result(auditLogService.getLogs(entityType, action, from, to, page, size))
                .build());
    }
}
