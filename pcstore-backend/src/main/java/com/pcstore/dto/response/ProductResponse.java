package com.pcstore.dto.response;

import com.pcstore.model.enums.Category;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String model;
    private String series;
    private Category category;
    private String description;
    private Double price;
    private Integer stockQuantity;

    private String socket;
    private Integer cores;
    private Integer threads;
    private Integer tdp;
    private Double baseClock;
    private Double boostClock;
    private Boolean integratedGraphics;

    private String ramType;
    private Integer ramSpeed;
    private Integer ramCapacity;
    private String casLatency;

    private Integer vram;
    private String vramType;
    private Boolean rayTracing;

    private Integer wattage;
    private String efficiency;
    private String modular;

    private String formFactor;
    private Boolean temperedGlass;
    private String caseType;

    private String coolingType;
    private Integer fanSize;
    private Boolean pwm;
    private Boolean rgb;

    private String storageType;
    private Integer storageCapacity;
    private String storageInterface;
    private Integer readSpeed;
    private Integer writeSpeed;

    private Double screenSize;
    private Integer refreshRate;
    private String resolution;
    private String panelType;
    private Double responseTime;

    private Map<String, Object> features;
    private Map<String, Object> specifications;

    private Double avgRating;
    private Integer reviewCount;
    private Boolean active;
    private LocalDateTime createdAt;

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