package Backend.controller;


import Backend.Io.ProfileRequest;
import Backend.Io.ProfileResponse;
import Backend.services.EmailService;
import Backend.services.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor

public class ProfileController {

     private final ProfileService profileService;
     private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
       public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
          ProfileResponse response = profileService.createProfile(request);
          try {
              emailService.sendWelcomeEmail(response.getEmail(), response.getName());
          } catch (Exception ex) {
              // Do not block registration if welcome email provider is temporarily unavailable.
              System.err.println("Welcome email sending failed: " + ex.getMessage());
          }
        return response;
    }

//    @GetMapping("/test")
//    public String test() {
//         return "Auth is Working";
//    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name")String email) {
          return profileService.getProfile(email);
    }

}
