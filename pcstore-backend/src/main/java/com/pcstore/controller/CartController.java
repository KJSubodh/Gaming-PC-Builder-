package com.pcstore.controller;

import com.pcstore.dto.request.AddToCartRequest;
import com.pcstore.dto.response.ApiResponse;
import com.pcstore.dto.response.CartResponse;
import com.pcstore.model.User;
import com.pcstore.service.CartService;
import com.pcstore.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    // Resolve the actual User entity from SecurityContext
    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return null;
        }
        return userService.getUserByEmail(auth.getName());
    }

    private String getOrCreateSessionId(HttpServletRequest request, User user) {
        if (user != null) return null;
        HttpSession session = request.getSession(true);
        String sessionId = (String) session.getAttribute("cartSessionId");
        if (sessionId == null) {
            sessionId = UUID.randomUUID().toString();
            session.setAttribute("cartSessionId", sessionId);
        }
        return sessionId;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(HttpServletRequest request) {
        User user = getCurrentUser();
        String sessionId = getOrCreateSessionId(request, user);
        return ResponseEntity.ok(cartService.getCart(sessionId, user));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            HttpServletRequest httpRequest) {
        User user = getCurrentUser();
        String sessionId = getOrCreateSessionId(httpRequest, user);
        cartService.addToCart(request, sessionId, user);
        return ResponseEntity.ok(new ApiResponse(true, "Added to cart"));
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity) {
        User user = getCurrentUser();
        cartService.updateQuantity(cartItemId, quantity, user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart updated"));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse> removeFromCart(@PathVariable Long cartItemId) {
        User user = getCurrentUser();
        cartService.removeFromCart(cartItemId, user);
        return ResponseEntity.ok(new ApiResponse(true, "Removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearCart(HttpServletRequest httpRequest) {
        User user = getCurrentUser();
        String sessionId = getOrCreateSessionId(httpRequest, user);
        cartService.clearCart(sessionId, user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart cleared"));
    }
}