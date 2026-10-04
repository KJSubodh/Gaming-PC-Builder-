package com.pcstore.model;

import com.pcstore.model.enums.Category;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    private String series;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(255)")
    private Category category;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private Double price;

    private Integer stockQuantity;

    // Boolean wrapper => Lombok generates getActive()/setActive(), NOT isActive()
    private Boolean active = true;

    // CPU fields
    private String socket;
    private Integer cores;
    private Integer threads;
    private Integer tdp;
    private Double baseClock;
    private Double boostClock;
    private Boolean integratedGraphics;

    // RAM fields
    private String ramType;
    private Integer ramSpeed;
    private Integer ramCapacity;
    private String casLatency;

    // GPU fields
    private Integer vram;
    private String vramType;
    private Boolean rayTracing;

    // PSU fields
    private Integer wattage;
    private String efficiency;
    private String modular;

    // Case fields
    private String formFactor;
    private Boolean temperedGlass;
    private String caseType;

    // Cooling fields
    private String coolingType;
    private Integer fanSize;
    private Boolean pwm;
    private Boolean rgb;

    // Storage fields
    private String storageType;
    private Integer storageCapacity;
    private String storageInterface;
    private Integer readSpeed;
    private Integer writeSpeed;

    // Monitor fields
    private Double screenSize;
    private Integer refreshRate;
    private String resolution;
    private String panelType;
    private Double responseTime;

    // JSON columns: @JdbcTypeCode tells Hibernate 7 to serialize the Map as JSON
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> features;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> specifications;

    @Column(name = "avg_rating")
    private Double avgRating;
    private Integer reviewCount;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}