package com.pcstore.service;

import com.pcstore.dto.request.ProductRequest;
import com.pcstore.dto.response.ProductResponse;
import com.pcstore.model.Product;
import com.pcstore.model.ProductImage;
import com.pcstore.model.enums.Category;
import com.pcstore.repository.ProductRepository;
import com.pcstore.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .filter(Product::isActive)
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
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());

        // CPU fields
        product.setSocket(request.getSocket());
        product.setCores(request.getCores());
        product.setThreads(request.getThreads());
        product.setTdp(request.getTdp());

        // RAM fields
        product.setRamType(request.getRamType());
        product.setRamSpeed(request.getRamSpeed());
        product.setRamCapacity(request.getRamCapacity());

        // GPU fields
        product.setVram(request.getVram());
        product.setRayTracing(request.getRayTracing());

        // PSU fields
        product.setWattage(request.getWattage());
        product.setEfficiency(request.getEfficiency());

        // Case fields
        product.setFormFactor(request.getFormFactor());
        product.setTemperedGlass(request.getTemperedGlass());

        // Monitor fields
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
                .category(product.getCategory())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .socket(product.getSocket())
                .cores(product.getCores())
                .threads(product.getThreads())
                .ramType(product.getRamType())
                .ramSpeed(product.getRamSpeed())
                .ramCapacity(product.getRamCapacity())
                .vram(product.getVram())
                .wattage(product.getWattage())
                .efficiency(product.getEfficiency())
                .formFactor(product.getFormFactor())
                .screenSize(product.getScreenSize())
                .refreshRate(product.getRefreshRate())
                .resolution(product.getResolution())
                .features(product.getFeatures())
                .specifications(product.getSpecifications())
                .avgRating(product.getAvgRating())
                .active(product.isActive())
                .images(images)
                .build();
    }

    public Product getProductByIdEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product updateProductEntity(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update fields
        existingProduct.setName(product.getName());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setModel(product.getModel());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setActive(product.isActive());

        // Update images
        existingProduct.setImages(product.getImages());

        // Update CPU fields
        existingProduct.setSocket(product.getSocket());
        existingProduct.setCores(product.getCores());
        existingProduct.setThreads(product.getThreads());

        // Update RAM fields
        existingProduct.setRamType(product.getRamType());
        existingProduct.setRamSpeed(product.getRamSpeed());
        existingProduct.setRamCapacity(product.getRamCapacity());

        // Update GPU fields
        existingProduct.setVram(product.getVram());

        // Update PSU fields
        existingProduct.setWattage(product.getWattage());
        existingProduct.setEfficiency(product.getEfficiency());

        // Update Case fields
        existingProduct.setFormFactor(product.getFormFactor());

        // Update Monitor fields
        existingProduct.setScreenSize(product.getScreenSize());
        existingProduct.setRefreshRate(product.getRefreshRate());
        existingProduct.setResolution(product.getResolution());

        existingProduct.setFeatures(product.getFeatures());
        existingProduct.setSpecifications(product.getSpecifications());

        return productRepository.save(existingProduct);
    }
}