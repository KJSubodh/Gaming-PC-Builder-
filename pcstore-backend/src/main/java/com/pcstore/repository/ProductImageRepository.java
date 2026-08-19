package com.pcstore.repository;

import com.pcstore.model.Product;
import com.pcstore.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductOrderBySortOrderAsc(Product product);
    void deleteByProduct(Product product);
}