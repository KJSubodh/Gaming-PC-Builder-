package com.pcstore.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private List<CartItemResponse> items;
    private Double totalAmount;
    private Integer itemCount;
    
    @Data
    @Builder
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String name;
        private Double price;
        private Integer quantity;
        private String image;
    }
}