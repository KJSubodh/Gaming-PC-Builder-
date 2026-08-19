package com.pcstore.repository;

import com.pcstore.model.CartItem;
import com.pcstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findBySessionId(String sessionId);
    List<CartItem> findByUser(User user);
    Optional<CartItem> findBySessionIdAndProductId(String sessionId, Long productId);
    Optional<CartItem> findByUserAndProductId(User user, Long productId);
    void deleteBySessionId(String sessionId);
}