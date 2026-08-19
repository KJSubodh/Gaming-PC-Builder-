package com.pcstore.service;

import com.pcstore.dto.CompatibilityCheckResponse;
import com.pcstore.model.Product;
import com.pcstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompatibilityService {
    
    private final ProductRepository productRepository;
    
    public CompatibilityCheckResponse checkCompatibility(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        List<String> issues = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        
        Product cpu = null;
        Product motherboard = null;
        Product ram = null;
        Product psu = null;
        Product cooler = null;
        Product pcCase = null;
        
        // Separate components
        for (Product p : products) {
            switch (p.getCategory()) {
                case CPU -> cpu = p;
                case MOTHERBOARD -> motherboard = p;
                case RAM -> ram = p;
                case PSU -> psu = p;
                case COOLING_CPU_AIR, COOLING_CPU_LIQUID -> cooler = p;
                case CASE -> pcCase = p;
            }
        }
        
        // CPU - Motherboard compatibility (Socket)
        if (cpu != null && motherboard != null) {
            if (cpu.getSocket() != null && motherboard.getSocket() != null) {
                if (!cpu.getSocket().equals(motherboard.getSocket())) {
                    issues.add(String.format("❌ CPU socket (%s) is not compatible with motherboard socket (%s)", 
                            cpu.getSocket(), motherboard.getSocket()));
                } else {
                    warnings.add(String.format("✓ CPU socket (%s) matches motherboard socket", cpu.getSocket()));
                }
            }
            
            // Check chipset compatibility
            if (cpu.getBrand() != null && motherboard.getBrand() != null) {
                if (cpu.getBrand().equals("AMD") && motherboard.getBrand().equals("Intel")) {
                    issues.add("❌ AMD CPU cannot be used with Intel motherboard");
                } else if (cpu.getBrand().equals("Intel") && motherboard.getBrand().equals("AMD")) {
                    issues.add("❌ Intel CPU cannot be used with AMD motherboard");
                }
            }
        }
        
        // RAM - Motherboard compatibility (DDR4/DDR5)
        if (ram != null && motherboard != null) {
            if (ram.getRamType() != null && motherboard.getRamType() != null) {
                if (!ram.getRamType().equals(motherboard.getRamType())) {
                    issues.add(String.format("❌ RAM type (%s) is not compatible with motherboard (%s)", 
                            ram.getRamType(), motherboard.getRamType()));
                }
            }
            
            // RAM speed warning
            if (ram.getRamSpeed() != null && motherboard.getRamSpeed() != null) {
                if (ram.getRamSpeed() > motherboard.getRamSpeed()) {
                    warnings.add(String.format("⚠️ RAM speed (%d MHz) will run at motherboard's max speed (%d MHz)", 
                            ram.getRamSpeed(), motherboard.getRamSpeed()));
                }
            }
        }
        
        // PSU wattage check
        if (psu != null) {
            int totalWattage = 0;
            if (cpu != null && cpu.getTdp() != null) totalWattage += cpu.getTdp();
            if (ram != null) totalWattage += 10;
            if (cooler != null) totalWattage += 5;
            
            // Add GPU wattage if present (assuming 250W for GPU)
            boolean hasGpu = products.stream().anyMatch(p -> p.getCategory() == com.pcstore.model.enums.Category.GPU);
            if (hasGpu) totalWattage += 250;
            
            if (psu.getWattage() != null) {
                double usagePercent = (totalWattage * 100.0) / psu.getWattage();
                if (usagePercent > 90) {
                    issues.add(String.format("❌ PSU wattage (%dW) may be insufficient. Estimated usage: %dW (%.0f%%)", 
                            psu.getWattage(), totalWattage, usagePercent));
                } else if (usagePercent > 80) {
                    warnings.add(String.format("⚠️ PSU wattage (%dW) is close to limit. Estimated usage: %dW (%.0f%%)", 
                            psu.getWattage(), totalWattage, usagePercent));
                }
            }
        }
        
        // Case compatibility
        if (pcCase != null && motherboard != null) {
            if (pcCase.getFormFactor() != null && motherboard.getFormFactor() != null) {
                if (!isFormFactorCompatible(pcCase.getFormFactor(), motherboard.getFormFactor())) {
                    issues.add(String.format("❌ Case form factor (%s) may not support motherboard (%s)", 
                            pcCase.getFormFactor(), motherboard.getFormFactor()));
                }
            }
        }
        
        // Cooler compatibility
        if (cooler != null && cpu != null && cooler.getSocket() != null && cpu.getSocket() != null) {
            if (!cooler.getSocket().equals(cpu.getSocket())) {
                warnings.add(String.format("⚠️ Cooler socket (%s) may not be compatible with CPU socket (%s)", 
                        cooler.getSocket(), cpu.getSocket()));
            }
        }
        
        return CompatibilityCheckResponse.builder()
                .compatible(issues.isEmpty())
                .issues(issues)
                .warnings(warnings)
                .build();
    }
    
    private boolean isFormFactorCompatible(String caseFormFactor, String motherboardFormFactor) {
        // ATX case can fit ATX, Micro ATX, Mini ITX
        // Micro ATX case can fit Micro ATX, Mini ITX
        // Mini ITX case can only fit Mini ITX
        return switch (caseFormFactor) {
            case "ATX" -> motherboardFormFactor.equals("ATX") || 
                         motherboardFormFactor.equals("Micro ATX") || 
                         motherboardFormFactor.equals("Mini ITX");
            case "Micro ATX" -> motherboardFormFactor.equals("Micro ATX") || 
                               motherboardFormFactor.equals("Mini ITX");
            case "Mini ITX" -> motherboardFormFactor.equals("Mini ITX");
            default -> false;
        };
    }
}