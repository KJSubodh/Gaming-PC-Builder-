package com.pcstore.repository;

import com.pcstore.model.Product;
import com.pcstore.model.enums.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryAndActiveTrue(Category category);

    List<Product> findBySocketAndActiveTrue(String socket);

    List<Product> findByCategoryAndSocketAndActiveTrue(Category category, String socket);

    List<Product> findByCategoryAndRamTypeAndActiveTrue(Category category, String ramType);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.active = true " +
           "AND (:category IS NULL OR p.category = :category) " +
           "ORDER BY p.createdAt DESC")
    List<Product> findLatestByCategory(@Param("category") Category category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.socket = :socket")
    List<Product> findBySocket(@Param("socket") String socket);
}