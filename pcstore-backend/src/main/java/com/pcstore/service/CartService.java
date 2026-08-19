package com.pcstore.service;

import com.pcstore.dto.request.AddToCartRequest;
import com.pcstore.dto.response.CartResponse;
import com.pcstore.model.CartItem;
import com.pcstore.model.Product;
import com.pcstore.model.User;
import com.pcstore.repository.CartRepository;
import com.pcstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    
    public CartResponse getCart(String sessionId, User user) {
        List<CartItem> cartItems;
        if (user != null) {
            cartItems = cartRepository.findByUser(user);
        } else {
            cartItems = cartRepository.findBySessionId(sessionId);
        }
        
        List<CartResponse.CartItemResponse> items = cartItems.stream()
                .map(this::convertToCartItemResponse)
                .collect(Collectors.toList());
        
        double total = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        
        return CartResponse.builder()
                .items(items)
                .totalAmount(total)
                .itemCount(items.size())
                .build();
    }
    
    @Transactional
    public void addToCart(AddToCartRequest request, String sessionId, User user) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }
        
        CartItem existingItem = null;
        if (user != null) {
            existingItem = cartRepository.findByUserAndProductId(user, request.getProductId()).orElse(null);
        } else {
            existingItem = cartRepository.findBySessionIdAndProductId(sessionId, request.getProductId()).orElse(null);
        }
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartRepository.save(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setSessionId(sessionId);
            cartItem.setUser(user);
            cartRepository.save(cartItem);
        }
    }
    
    @Transactional
    public void updateQuantity(Long cartItemId, int quantity, User user) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (user != null && cartItem.getUser() != null && !cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (quantity <= 0) {
            cartRepository.delete(cartItem);
        } else {
            if (cartItem.getProduct().getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
            cartItem.setQuantity(quantity);
            cartRepository.save(cartItem);
        }
    }
    
    @Transactional
    public void removeFromCart(Long cartItemId, User user) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (user != null && cartItem.getUser() != null && !cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        cartRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(String sessionId, User user) {
        if (user != null) {
            List<CartItem> items = cartRepository.findByUser(user);
            cartRepository.deleteAll(items);
        } else {
            cartRepository.deleteBySessionId(sessionId);
        }
    }
    
    private CartResponse.CartItemResponse convertToCartItemResponse(CartItem item) {
        Product product = item.getProduct();
        return CartResponse.CartItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(item.getQuantity())
                .image(product.getImages().isEmpty() ? null : product.getImages().get(0).getUrl())
                .build();
    }
}