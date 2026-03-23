package com.Authentication.BACKEND.Controller;

import com.Authentication.BACKEND.Io.ProfileRequest;
import com.Authentication.BACKEND.Io.ProfileResponse;
import com.Authentication.BACKEND.Service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor

public class ProfileController {

     private final ProfileService profileService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
       public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
          ProfileResponse response = profileService.createProfile(request);
          //Welcome Email
        return response;
    }

}
