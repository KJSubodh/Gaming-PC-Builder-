package com.pcstore.controller;

import com.pcstore.dto.request.ProductRequest;
import com.pcstore.dto.response.ApiResponse;
import com.pcstore.dto.response.OrderResponse;
import com.pcstore.dto.response.ProductResponse;
import com.pcstore.model.Product;
import com.pcstore.model.ProductImage;
import com.pcstore.model.User;
import com.pcstore.model.enums.UserRole;
import com.pcstore.repository.UserRepository;
import com.pcstore.service.ImageUploadService;
import com.pcstore.service.OrderService;
import com.pcstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// Add these to your existing imports
import com.pcstore.repository.ProductRepository;
import com.pcstore.repository.OrderRepository;
import com.pcstore.repository.ProductImageRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductImageRepository productImageRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalUsers", userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER)
                .count());
        stats.put("totalRevenue", orderRepository.findAll().stream()
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(productService.getProductById(product.getId()));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(productService.getProductById(product.getId()));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
    }

    // NEW: Upload images for a product
    @PostMapping("/products/{id}/images")
    public ResponseEntity<List<Map<String, Object>>> uploadProductImages(
            @PathVariable Long id,
            @RequestParam("images") List<MultipartFile> images) throws IOException {

        Product product = productService.getProductByIdEntity(id);
        List<Map<String, Object>> uploadedImages = new ArrayList<>();

        int currentSortOrder = product.getImages().size();

        for (MultipartFile image : images) {
            String imageUrl = imageUploadService.uploadImage(image);

            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setUrl(imageUrl);
            productImage.setSortOrder(currentSortOrder);

            boolean isPrimary = product.getImages().isEmpty() && currentSortOrder == 0;
            productImage.setIsPrimary(isPrimary);

            product.getImages().add(productImage);
            currentSortOrder++;
        }

        Product saved = productService.updateProductEntity(id, product);

        // Return the saved image objects with IDs so frontend can delete/set primary
        for (ProductImage img : saved.getImages()) {
            Map<String, Object> imgMap = new HashMap<>();
            imgMap.put("id", img.getId());
            imgMap.put("url", img.getUrl());
            imgMap.put("isPrimary", img.getIsPrimary());
            uploadedImages.add(imgMap);
        }

        return ResponseEntity.ok(uploadedImages);
    }

    // NEW: Delete a specific image
    @DeleteMapping("/products/{productId}/images/{imageId}")
    public ResponseEntity<ApiResponse> deleteProductImage(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        Product product = productService.getProductByIdEntity(productId);

        ProductImage imageToDelete = product.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Delete physical file
        imageUploadService.deleteImage(imageToDelete.getUrl());

        // Remove from database
        product.getImages().remove(imageToDelete);

        // If deleted image was primary, set another as primary
        if (imageToDelete.getIsPrimary() && !product.getImages().isEmpty()) {
            product.getImages().get(0).setIsPrimary(true);
        }

        productService.updateProductEntity(productId, product);
        return ResponseEntity.ok(new ApiResponse(true, "Image deleted successfully"));
    }

    // NEW: Set primary image
    @PutMapping("/products/{productId}/images/{imageId}/primary")
    public ResponseEntity<ApiResponse> setPrimaryImage(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        Product product = productService.getProductByIdEntity(productId);

        for (ProductImage image : product.getImages()) {
            image.setIsPrimary(image.getId().equals(imageId));
        }

        productService.updateProductEntity(productId, product);
        return ResponseEntity.ok(new ApiResponse(true, "Primary image updated"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Order status updated"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getId());
                    map.put("email", u.getEmail());
                    map.put("firstName", u.getFirstName());
                    map.put("lastName", u.getLastName());
                    map.put("phone", u.getPhone());
                    map.put("role", u.getRole().name());
                    map.put("createdAt", u.getCreatedAt());
                    map.put("verified", u.isVerified());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(UserRole.valueOf(role));
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Role updated"));
    }
}