package com.pcstore.dto.request;

import com.pcstore.model.enums.Category;
import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {
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
    private Integer tdp;
    
    // RAM fields
    private String ramType;
    private Integer ramSpeed;
    private Integer ramCapacity;
    
    // GPU fields
    private Integer vram;
    private Boolean rayTracing;
    
    // PSU fields
    private Integer wattage;
    private String efficiency;
    
    // Case fields
    private String formFactor;
    private Boolean temperedGlass;
    
    // Monitor fields
    private Double screenSize;
    private Integer refreshRate;
    private String resolution;
    
    private List<String> features;
    private Object specifications;
}