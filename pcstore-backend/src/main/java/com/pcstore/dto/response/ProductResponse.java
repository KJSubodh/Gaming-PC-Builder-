package com.pcstore.dto.response;

import com.pcstore.model.enums.Category;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String model;
    private Category category;
    private String description;
    private Double price;
    private Integer stockQuantity;
    
    // CPU fields
    private String socket;
    private Integer cores;
    private Integer threads;
    
    // RAM fields
    private String ramType;
    private Integer ramSpeed;
    private Integer ramCapacity;
    
    // GPU fields
    private Integer vram;
    
    // PSU fields
    private Integer wattage;
    private String efficiency;
    
    // Case fields
    private String formFactor;
    
    // Monitor fields
    private Double screenSize;
    private Integer refreshRate;
    private String resolution;
    
    private List<String> features;
    private Object specifications;
    private Double avgRating;
    private boolean active;
    private List<ImageDto> images;

    @Data
    @Builder
    public static class ImageDto {
        private Long id;
        private String url;
        private Boolean isPrimary;
        private Integer sortOrder;
    }
}