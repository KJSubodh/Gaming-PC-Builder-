package com.pcstore.service;

import com.pcstore.dto.request.ProductRequest;
import com.pcstore.dto.response.ProductResponse;
import com.pcstore.model.Product;
import com.pcstore.model.enums.Category;
import com.pcstore.repository.ProductRepository;
import com.pcstore.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    // Product.active is a Boolean (nullable), so Lombok generates getActive(), not isActive().
    // A null value is treated as inactive instead of throwing a NullPointerException.
    private static boolean isActive(Product product) {
        return Boolean.TRUE.equals(product.getActive());
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .filter(ProductService::isActive)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(Category category) {
        return productRepository.findByCategoryAndActiveTrue(category).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToResponse(product);
    }

    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getLatestProducts(int limit) {
        return productRepository.findLatestByCategory(null, PageRequest.of(0, limit)).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getCompatibleComponents(String socket) {
        return productRepository.findBySocketAndActiveTrue(socket).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ============================================
    // Socket / Series based filtering
    // ============================================

    public Map<String, List<ProductResponse>> getCpusBySocket() {
        return productRepository.findByCategoryAndActiveTrue(Category.CPU).stream()
                .filter(cpu -> cpu.getSocket() != null && !cpu.getSocket().isBlank())
                .map(this::convertToResponse)
                .collect(Collectors.groupingBy(ProductResponse::getSocket));
    }

    public Map<String, List<ProductResponse>> getCpusBySeries() {
        return productRepository.findByCategoryAndActiveTrue(Category.CPU).stream()
                .filter(cpu -> cpu.getSeries() != null && !cpu.getSeries().isBlank())
                .map(this::convertToResponse)
                .collect(Collectors.groupingBy(ProductResponse::getSeries));
    }

    public List<ProductResponse> getMotherboardsBySocket(String socket) {
        return productRepository
                .findByCategoryAndSocketAndActiveTrue(Category.MOTHERBOARD, socket)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getRamByType(String ramType) {
        return productRepository
                .findByCategoryAndRamTypeAndActiveTrue(Category.RAM, ramType)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        updateProductFields(product, request);
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        updateProductFields(product, request);
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private void updateProductFields(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setModel(request.getModel());
        product.setSeries(request.getSeries());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());

        product.setSocket(request.getSocket());
        product.setCores(request.getCores());
        product.setThreads(request.getThreads());
        product.setTdp(request.getTdp());

        product.setRamType(request.getRamType());
        product.setRamSpeed(request.getRamSpeed());
        product.setRamCapacity(request.getRamCapacity());

        product.setVram(request.getVram());
        product.setRayTracing(request.getRayTracing());

        product.setWattage(request.getWattage());
        product.setEfficiency(request.getEfficiency());

        product.setFormFactor(request.getFormFactor());
        product.setTemperedGlass(request.getTemperedGlass());

        product.setScreenSize(request.getScreenSize());
        product.setRefreshRate(request.getRefreshRate());
        product.setResolution(request.getResolution());

        product.setFeatures(request.getFeatures());
        product.setSpecifications(request.getSpecifications());
    }

    private ProductResponse convertToResponse(Product product) {
        List<ProductResponse.ImageDto> images = productImageRepository
                .findByProductOrderBySortOrderAsc(product)
                .stream()
                .map(img -> ProductResponse.ImageDto.builder()
                        .id(img.getId())
                        .url(img.getUrl())
                        .isPrimary(img.getIsPrimary())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .model(product.getModel())
                .series(product.getSeries())
                .category(product.getCategory())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .socket(product.getSocket())
                .cores(product.getCores())
                .threads(product.getThreads())
                .tdp(product.getTdp())
                .baseClock(product.getBaseClock())
                .boostClock(product.getBoostClock())
                .integratedGraphics(product.getIntegratedGraphics())
                .ramType(product.getRamType())
                .ramSpeed(product.getRamSpeed())
                .ramCapacity(product.getRamCapacity())
                .casLatency(product.getCasLatency())
                .vram(product.getVram())
                .vramType(product.getVramType())
                .rayTracing(product.getRayTracing())
                .wattage(product.getWattage())
                .efficiency(product.getEfficiency())
                .modular(product.getModular())
                .formFactor(product.getFormFactor())
                .temperedGlass(product.getTemperedGlass())
                .caseType(product.getCaseType())
                .coolingType(product.getCoolingType())
                .fanSize(product.getFanSize())
                .pwm(product.getPwm())
                .rgb(product.getRgb())
                .storageType(product.getStorageType())
                .storageCapacity(product.getStorageCapacity())
                .storageInterface(product.getStorageInterface())
                .readSpeed(product.getReadSpeed())
                .writeSpeed(product.getWriteSpeed())
                .screenSize(product.getScreenSize())
                .refreshRate(product.getRefreshRate())
                .resolution(product.getResolution())
                .panelType(product.getPanelType())
                .responseTime(product.getResponseTime())
                .features(product.getFeatures())
                .specifications(product.getSpecifications())
                .avgRating(product.getAvgRating())
                .reviewCount(product.getReviewCount())
                .active(isActive(product))
                .createdAt(product.getCreatedAt())
                .images(images)
                .build();
    }

    public Product getProductByIdEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Transactional
    public Product updateProductEntity(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(product.getName());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setModel(product.getModel());
        existingProduct.setSeries(product.getSeries());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setActive(product.getActive());
        // NOTE: images are intentionally NOT replaced here. Product.images has
        // orphanRemoval = true, and swapping the collection reference throws
        // "A collection with cascade=all-delete-orphan was no longer referenced".
        // Manage images through ProductImageRepository instead.

        existingProduct.setSocket(product.getSocket());
        existingProduct.setCores(product.getCores());
        existingProduct.setThreads(product.getThreads());

        existingProduct.setRamType(product.getRamType());
        existingProduct.setRamSpeed(product.getRamSpeed());
        existingProduct.setRamCapacity(product.getRamCapacity());

        existingProduct.setVram(product.getVram());

        existingProduct.setWattage(product.getWattage());
        existingProduct.setEfficiency(product.getEfficiency());

        existingProduct.setFormFactor(product.getFormFactor());

        existingProduct.setScreenSize(product.getScreenSize());
        existingProduct.setRefreshRate(product.getRefreshRate());
        existingProduct.setResolution(product.getResolution());

        existingProduct.setFeatures(product.getFeatures());
        existingProduct.setSpecifications(product.getSpecifications());

        return productRepository.save(existingProduct);
    }
}