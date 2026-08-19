package com.pcstore.dto;

import lombok.Data;
import java.util.List;

@Data
public class PCConfigurationRequest {
    private List<Long> productIds;
}