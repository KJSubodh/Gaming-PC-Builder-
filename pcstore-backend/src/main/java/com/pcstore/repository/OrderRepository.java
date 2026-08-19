package com.pcstore.repository;

import com.pcstore.model.Order;
import com.pcstore.model.User;
import com.pcstore.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findBySessionIdOrderByCreatedAtDesc(String sessionId);
    List<Order> findByOrderStatus(OrderStatus status);
    Optional<Order> findByOrderNumber(String orderNumber);
}