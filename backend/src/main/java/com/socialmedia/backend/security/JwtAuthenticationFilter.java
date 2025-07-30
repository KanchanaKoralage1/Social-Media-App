// package com.socialmedia.backend.security;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;

// @Component
// @RequiredArgsConstructor
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private final JwtTokenUtil jwtTokenUtil;
//     private final UserDetailsService userDetailsService;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain) throws ServletException, IOException {

//         final String authHeader = request.getHeader("Authorization");

//             System.out.println("Jwt Filter: " + request.getMethod() + " " + request.getRequestURI());
//     System.out.println("Auth Header: " + authHeader);

//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         try {
//             final String jwt = authHeader.substring(7);
//             final String username = jwtTokenUtil.getUsernameFromToken(jwt);

//             if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                 UserDetails userDetails = userDetailsService.loadUserByUsername(username);

//                 if (jwtTokenUtil.validateToken(jwt, userDetails)) {
//                     UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                             userDetails,
//                             null,
//                             userDetails.getAuthorities());
//                     authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                     SecurityContextHolder.getContext().setAuthentication(authToken);
//                 }
//             }
//         } catch (Exception e) {
//             logger.error("Cannot set user authentication: {}", e);
//         }

//         filterChain.doFilter(request, response);
//     }
// }



package com.socialmedia.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenUtil jwtTokenUtil;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
          HttpServletResponse response,
          FilterChain filterChain) throws ServletException, IOException {

      final String authHeader = request.getHeader("Authorization");

      System.out.println("Jwt Filter: " + request.getMethod() + " " + request.getRequestURI());
      System.out.println("Auth Header: " + authHeader);

      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
          System.out.println("No Bearer token found or header is null. Skipping JWT filter chain.");
          filterChain.doFilter(request, response);
          return;
      }

      try {
          final String jwt = authHeader.substring(7);
          System.out.println("Extracted JWT: " + jwt);

          final String username = jwtTokenUtil.getUsernameFromToken(jwt);
          System.out.println("Username from JWT: " + username);

          if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
              UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
              System.out.println("Loaded UserDetails for: " + userDetails.getUsername() + " with roles: " + userDetails.getAuthorities());

              if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                  System.out.println("JWT token is valid.");
                  UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                          userDetails,
                          null,
                          userDetails.getAuthorities());
                  authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                  SecurityContextHolder.getContext().setAuthentication(authToken);
                  System.out.println("SecurityContextHolder set for user: " + username);
              } else {
                  System.out.println("JWT token validation failed for user: " + username);
              }
          } else if (username == null) {
              System.out.println("Username could not be extracted from JWT.");
          } else {
              System.out.println("SecurityContextHolder already has authentication for user: " + username);
          }
      } catch (Exception e) {
          logger.error("Cannot set user authentication: " + e.getMessage(), e); // Log full stack trace
          System.out.println("Exception during JWT authentication: " + e.getMessage());
      }

      filterChain.doFilter(request, response);
  }
}
