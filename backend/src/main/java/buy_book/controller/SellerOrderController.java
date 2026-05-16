package buy_book.controller;

import buy_book.constant.OrderStatus;
import buy_book.dto.response.ApiResponse;
import buy_book.dto.response.OrderResponse;
import buy_book.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SellerOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getSellerOrders(
            @RequestParam(required = false) OrderStatus status,
            @AuthenticationPrincipal Jwt jwt) {
        List<OrderResponse> orders = status != null
                ? adminOrderService.getSellerOrdersByStatus(jwt.getSubject(), status)
                : adminOrderService.getSellerOrders(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .code(200)
                .result(orders)
                .build());
    }
}
