package Backend.services;


import Backend.Io.ProfileRequest;
import Backend.Io.ProfileResponse;

public interface ProfileService {

   ProfileResponse createProfile(ProfileRequest request);

   ProfileResponse getProfile(String email);

   void sendResetOtp(String email);

   void resetPassword(String email, String otp, String newPassword);

   void sendOtp(String email);

   void verifyOtp(String email, String otp);


}
