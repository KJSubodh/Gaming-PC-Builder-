package com.pcstore.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String notes;
    private List<OrderItemRequest> items;
    private Double subtotal;     // ADD THIS
    private Double tax;          // ADD THIS
    private Double shipping;     // ADD THIS
    private Double totalAmount;  // ADD THIS
    
    @Data
    public static class OrderItemRequest {
        private Long productId;
        private String productName;
        private Integer quantity;
        private Double price;
    }
}