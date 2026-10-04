package com.pcstore.dto.request;

import com.pcstore.model.enums.Category;
import lombok.Data;
import java.util.Map;

@Data
public class ProductRequest {
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

    private String ramType;
    private Integer ramSpeed;
    private Integer ramCapacity;

    private Integer vram;
    private Boolean rayTracing;

    private Integer wattage;
    private String efficiency;

    private String formFactor;
    private Boolean temperedGlass;

    private Double screenSize;
    private Integer refreshRate;
    private String resolution;

    private Map<String, Object> features;
    private Map<String, Object> specifications;
}