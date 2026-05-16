package buy_book.service.impl;

import buy_book.dto.response.AuditLogResponse;
import buy_book.dto.response.PageResponse;
import buy_book.entity.AuditLog;
import buy_book.repository.AuditLogRepository;
import buy_book.repository.UserRepository;
import buy_book.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository     userRepository;

    @Override
    public void log(String adminUsername, String action, String entityType,
                    Long entityId, String entityName, String detail,
                    String oldValue, String newValue, String ipAddress) {

        String fullName = userRepository.findByUsername(adminUsername)
                .map(u -> u.getFullName() != null && !u.getFullName().isBlank()
                        ? u.getFullName() : adminUsername)
                .orElse(adminUsername);

        auditLogRepository.save(AuditLog.builder()
                .adminUsername(adminUsername)
                .adminFullName(fullName)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .entityName(entityName)
                .detail(detail)
                .oldValue(oldValue)
                .newValue(newValue)
                .ipAddress(ipAddress)
                .build());
    }

    @Override
    public PageResponse<AuditLogResponse> getLogs(String entityType, String action,
                                                   LocalDateTime fromDate, LocalDateTime toDate,
                                                   int page, int size) {
        String et = (entityType != null && !entityType.isBlank()) ? entityType : null;
        String ac = (action     != null && !action.isBlank())     ? action     : null;

        Page<AuditLog> result = auditLogRepository.findWithFilters(et, ac, fromDate, toDate,
                PageRequest.of(page, size));

        List<AuditLogResponse> content = result.getContent().stream()
                .map(log -> AuditLogResponse.builder()
                        .id(log.getId())
                        .adminUsername(log.getAdminUsername())
                        .adminFullName(log.getAdminFullName())
                        .action(log.getAction())
                        .entityType(log.getEntityType())
                        .entityId(log.getEntityId())
                        .entityName(log.getEntityName())
                        .detail(log.getDetail())
                        .oldValue(log.getOldValue())
                        .newValue(log.getNewValue())
                        .ipAddress(log.getIpAddress())
                        .createdAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return PageResponse.<AuditLogResponse>builder()
                .content(content)
                .pageNumber(result.getNumber())
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }
}
