// package com.pcstore.service;

// import com.pcstore.dto.CompatibilityCheckResponse;
// import com.pcstore.model.Product;
// import com.pcstore.repository.ProductRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import java.util.ArrayList;
// import java.util.List;

// @Service
// @RequiredArgsConstructor
// public class CompatibilityService {

//     private final ProductRepository productRepository;

//     public CompatibilityCheckResponse checkCompatibility(List<Long> productIds) {
//         List<Product> products = productRepository.findAllById(productIds);
//         List<String> issues = new ArrayList<>();
//         List<String> warnings = new ArrayList<>();

//         Product cpu = null;
//         Product motherboard = null;
//         Product ram = null;
//         Product psu = null;
//         Product cooler = null;
//         Product pcCase = null;

//         for (Product p : products) {
//             switch (p.getCategory()) {
//                 case CPU -> cpu = p;
//                 case MOTHERBOARD -> motherboard = p;
//                 case RAM -> ram = p;
//                 case PSU -> psu = p;
//                 case COOLING_CPU_AIR, COOLING_CPU_LIQUID -> cooler = p;
//                 case CASE -> pcCase = p;
//                 default -> { /* No rules for other categories */ }
//             }
//         }

//         // CPU ↔ Motherboard — socket match
//         if (cpu != null && motherboard != null) {
//             String cpuSocket = cpu.getSocket();
//             String moboSocket = motherboard.getSocket();

//             if (cpuSocket != null && moboSocket != null) {
//                 if (!cpuSocket.equalsIgnoreCase(moboSocket)) {
//                     issues.add(String.format(
//                         "❌ CPU socket (%s) is not compatible with motherboard socket (%s).",
//                         cpuSocket, moboSocket));
//                 } else {
//                     warnings.add(String.format("✓ CPU socket (%s) matches motherboard", cpuSocket));
//                 }
//             }
//         }

//         // CPU ↔ RAM — socket dictates DDR generation
//         if (cpu != null && ram != null) {
//             String socket = cpu.getSocket();
//             String ramType = ram.getRamType();

//             if (socket != null && ramType != null) {
//                 if ("AM4".equalsIgnoreCase(socket) && !"DDR4".equalsIgnoreCase(ramType)) {
//                     issues.add("❌ AM4 CPUs only support DDR4 RAM. You selected " + ramType);
//                 } else if ("AM5".equalsIgnoreCase(socket) && !"DDR5".equalsIgnoreCase(ramType)) {
//                     issues.add("❌ AM5 CPUs only support DDR5 RAM. You selected " + ramType);
//                 } else if ("LGA1851".equalsIgnoreCase(socket) && !"DDR5".equalsIgnoreCase(ramType)) {
//                     issues.add("❌ Intel Core Ultra (LGA1851) only supports DDR5 RAM.");
//                 }
//             }
//         }

//         // RAM ↔ Motherboard — physical
//         if (ram != null && motherboard != null) {
//             if (ram.getRamType() != null && motherboard.getRamType() != null) {
//                 if (!ram.getRamType().equalsIgnoreCase(motherboard.getRamType())) {
//                     issues.add(String.format(
//                         "❌ This motherboard is designed for %s memory. You selected %s RAM.",
//                         motherboard.getRamType(), ram.getRamType()));
//                 }
//             }

//             if (ram.getRamSpeed() != null && motherboard.getRamSpeed() != null) {
//                 if (ram.getRamSpeed() > motherboard.getRamSpeed()) {
//                     warnings.add(String.format(
//                         "⚠️ RAM rated at %d MHz will run at the motherboard's max supported speed of %d MHz.",
//                         ram.getRamSpeed(), motherboard.getRamSpeed()));
//                 }
//             }
//         }

//         // PSU wattage
//         if (psu != null) {
//             int totalWattage = 0;
//             if (cpu != null && cpu.getTdp() != null) totalWattage += cpu.getTdp();
//             if (ram != null) totalWattage += 10;
//             if (cooler != null) totalWattage += 5;

//             boolean hasGpu = products.stream()
//                     .anyMatch(p -> p.getCategory() == com.pcstore.model.enums.Category.GPU);
//             if (hasGpu) totalWattage += 250;

//             if (psu.getWattage() != null) {
//                 double usagePercent = (totalWattage * 100.0) / psu.getWattage();
//                 if (usagePercent > 90) {
//                     issues.add(String.format(
//                         "❌ PSU wattage (%dW) may be insufficient. Estimated usage: %dW (%.0f%%)",
//                         psu.getWattage(), totalWattage, usagePercent));
//                 } else if (usagePercent > 80) {
//                     warnings.add(String.format(
//                         "⚠️ PSU wattage (%dW) is close to limit. Estimated usage: %dW (%.0f%%)",
//                         psu.getWattage(), totalWattage, usagePercent));
//                 }
//             }
//         }

//         // Case ↔ Motherboard — form factor
//         if (pcCase != null && motherboard != null) {
//             if (pcCase.getFormFactor() != null && motherboard.getFormFactor() != null) {
//                 if (!isFormFactorCompatible(pcCase.getFormFactor(), motherboard.getFormFactor())) {
//                     issues.add(String.format(
//                         "❌ Case form factor (%s) may not support motherboard (%s)",
//                         pcCase.getFormFactor(), motherboard.getFormFactor()));
//                 }
//             }
//         }

//         // Cooler ↔ CPU — socket
//         if (cooler != null && cpu != null
//                 && cooler.getSocket() != null && cpu.getSocket() != null) {
//             if (!cooler.getSocket().equalsIgnoreCase(cpu.getSocket())) {
//                 warnings.add(String.format(
//                     "⚠️ Cooler socket (%s) may not be compatible with CPU socket (%s)",
//                     cooler.getSocket(), cpu.getSocket()));
//             }
//         }

//         return CompatibilityCheckResponse.builder()
//                 .compatible(issues.isEmpty())
//                 .issues(issues)
//                 .warnings(warnings)
//                 .build();
//     }

//     private boolean isFormFactorCompatible(String caseFormFactor, String motherboardFormFactor) {
//         return switch (caseFormFactor) {
//             case "ATX" -> motherboardFormFactor.equals("ATX")
//                     || motherboardFormFactor.equals("Micro ATX")
//                     || motherboardFormFactor.equals("Mini ITX");
//             case "Micro ATX" -> motherboardFormFactor.equals("Micro ATX")
//                     || motherboardFormFactor.equals("Mini ITX");
//             case "Mini ITX" -> motherboardFormFactor.equals("Mini ITX");
//             default -> false;
//         };
//     }
// }