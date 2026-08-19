package com.pcstore.controller;

import com.pcstore.dto.CompatibilityCheckResponse;
import com.pcstore.dto.PCConfigurationRequest;
import com.pcstore.service.CompatibilityService;
import com.pcstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compatibility")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CompatibilityController {
    
    private final CompatibilityService compatibilityService;
    private final ProductService productService;
    
    @PostMapping("/check")
    public ResponseEntity<CompatibilityCheckResponse> checkCompatibility(
            @RequestBody PCConfigurationRequest request) {
        return ResponseEntity.ok(compatibilityService.checkCompatibility(request.getProductIds()));
    }
    
    @GetMapping("/socket/{socket}/compatible")
    public ResponseEntity<?> getCompatibleComponents(@PathVariable String socket) {
        return ResponseEntity.ok(productService.getCompatibleComponents(socket));
    }
}