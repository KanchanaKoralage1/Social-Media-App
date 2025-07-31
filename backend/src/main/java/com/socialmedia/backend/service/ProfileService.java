// package com.socialmedia.backend.service;

// import com.socialmedia.backend.dto.ProfileResponse;
// import com.socialmedia.backend.dto.ProfileUpdateRequest;
// import com.socialmedia.backend.model.User;
// import com.socialmedia.backend.repository.UserRepository;
// import com.socialmedia.backend.security.JwtTokenUtil;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class ProfileService {

//     private final UserRepository userRepository;
//     private final JwtTokenUtil jwtTokenUtil;

//     public User getProfile(String token) {
//         String username = jwtTokenUtil.getUsernameFromToken(token);
//         return userRepository.findByUsername(username)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
//     }

//     public User updateProfile(String token, ProfileUpdateRequest request) {
//         String username = jwtTokenUtil.getUsernameFromToken(token);
//         User user = userRepository.findByUsername(username)
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         if (request.getFullName() != null)
//             user.setFullName(request.getFullName());
//         if (request.getBio() != null)
//             user.setBio(request.getBio());
//         if (request.getWebsite() != null)
//             user.setWebsite(request.getWebsite());
//         if (request.getLocation() != null)
//             user.setLocation(request.getLocation());
//         if (request.getProfileImage() != null)
//             user.setProfileImage(request.getProfileImage());
//         if (request.getBackgroundImage() != null)
//             user.setBackgroundImage(request.getBackgroundImage());

//         return userRepository.save(user);
//     }

//     public ProfileResponse toProfileResponse(User user) {
//         ProfileResponse dto = new ProfileResponse();
//         dto.setId(user.getId());
//         dto.setUsername(user.getUsername());
//         dto.setFullName(user.getFullName());
//         dto.setProfileImage(user.getProfileImage());
//         dto.setBackgroundImage(user.getBackgroundImage());
//         dto.setBio(user.getBio());
//         dto.setWebsite(user.getWebsite());
//         dto.setLocation(user.getLocation());
//         dto.setFollowersCount(user.getFollowersCount()); // Added
//         dto.setFollowingCount(user.getFollowingCount()); // Added
//         dto.setPostsCount(user.getPostsCount());        
//         dto.setIsFollowing(currentUser.getFollowing().contains(profileUser));
//         return dto;
//     }

//     public User getProfileByUsername(String username) {
//         return userRepository.findByUsername(username).orElse(null);
//     }

// }


package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.ProfileResponse;
import com.socialmedia.backend.dto.ProfileUpdateRequest;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.UserRepository;
import com.socialmedia.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

  private final UserRepository userRepository;
  private final JwtTokenUtil jwtTokenUtil;

  public User getProfile(String token) {
      String username = jwtTokenUtil.getUsernameFromToken(token);
      return userRepository.findByUsername(username)
              .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public User updateProfile(String token, ProfileUpdateRequest request) {
      String username = jwtTokenUtil.getUsernameFromToken(token);
      User user = userRepository.findByUsername(username)
              .orElseThrow(() -> new RuntimeException("User not found"));

      if (request.getFullName() != null)
          user.setFullName(request.getFullName());
      if (request.getBio() != null)
          user.setBio(request.getBio());
      if (request.getWebsite() != null)
          user.setWebsite(request.getWebsite());
      if (request.getLocation() != null)
          user.setLocation(request.getLocation());
      if (request.getProfileImage() != null)
          user.setProfileImage(request.getProfileImage());
      if (request.getBackgroundImage() != null)
          user.setBackgroundImage(request.getBackgroundImage());

      return userRepository.save(user);
  }

  public ProfileResponse toProfileResponse(User currentUser, User profileUser) {
      System.out.println("toProfileResponse: currentUser=" + currentUser.getUsername() + ", profileUser=" + profileUser.getUsername());
      ProfileResponse dto = new ProfileResponse();
      dto.setId(profileUser.getId());
      dto.setUsername(profileUser.getUsername());
      dto.setFullName(profileUser.getFullName());
      dto.setProfileImage(profileUser.getProfileImage());
      dto.setBackgroundImage(profileUser.getBackgroundImage());
      dto.setBio(profileUser.getBio());
      dto.setWebsite(profileUser.getWebsite());
      dto.setLocation(profileUser.getLocation());
      dto.setFollowersCount(profileUser.getFollowersCount()); // Added
      dto.setFollowingCount(profileUser.getFollowingCount()); // Added
      dto.setPostsCount(profileUser.getPostsCount());         // Added
      dto.setFollowing(currentUser.getFollowing().contains(profileUser)); // Added
      return dto;
  }

  public User getProfileByUsername(String username) {
      return userRepository.findByUsername(username).orElse(null);
  }

}
