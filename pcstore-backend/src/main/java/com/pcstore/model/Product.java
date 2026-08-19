package com.pcstore.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.pcstore.model.enums.Category;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String model;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    private Integer stockQuantity = 0;
    private boolean active = true;

    // CPU specific
    private String socket;
    private Integer cores;
    private Integer threads;
    private Double baseClock;
    private Double boostClock;
    private Integer tdp;
    private Boolean integratedGraphics;

    // RAM specific
    private String ramType;
    private Integer ramSpeed;
    private Integer ramCapacity;
    private String casLatency;
    private Boolean rgb;

    // GPU specific
    private String chipset;
    private Integer vram;
    private String vramType;
    private Boolean rayTracing;

    // Storage specific
    private String storageType;
    private Integer storageCapacity;
    private String storageInterface;
    private Integer readSpeed;
    private Integer writeSpeed;

    // PSU specific
    private Integer wattage;
    private String efficiency;
    private String modular;

    // Case specific
    private String formFactor;
    private String caseType;
    private Boolean temperedGlass;

    // Monitor specific
    private Double screenSize;
    private Integer refreshRate;
    private String resolution;
    private String panelType;
    private Double responseTime;

    // Cooling specific
    private String coolingType;
    private Integer fanSize;
    private Boolean pwm;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> features = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    private Object specifications;

    private Double avgRating = 0.0;
    private Integer reviewCount = 0;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();
}