package com.pcstore.repository;

import com.pcstore.model.Product;
import com.pcstore.model.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryAndActiveTrue(Category category);
    List<Product> findByBrandAndActiveTrue(String brand);
    List<Product> findBySocketAndActiveTrue(String socket);
    List<Product> findByRamTypeAndActiveTrue(String ramType);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.model) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.active = true ORDER BY p.createdAt DESC")
    List<Product> findLatestByCategory(@Param("category") Category category, org.springframework.data.domain.Pageable pageable);
}