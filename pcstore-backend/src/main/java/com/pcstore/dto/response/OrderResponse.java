package com.pcstore.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String orderStatus;
    private String paymentStatus;
    private Double subtotal;
    private Double tax;
    private Double shippingCost;
    private Double totalAmount;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    
    @Data
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Integer quantity;
        private Double unitPrice;
        private Double totalPrice;
    }
}