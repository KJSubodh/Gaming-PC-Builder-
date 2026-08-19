package com.pcstore.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CompatibilityCheckResponse {
    private boolean compatible;
    private List<String> issues;
    private List<String> warnings;
}