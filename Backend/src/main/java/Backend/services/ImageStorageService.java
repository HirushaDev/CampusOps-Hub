package Backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> savedUrls = new ArrayList<>();

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("Created upload directory: " + uploadPath.toAbsolutePath());
        }

        if (images == null || images.isEmpty()) {
            System.out.println("No images to save");
            return savedUrls;
        }

        for (MultipartFile image : images) {
            if (image != null && !image.isEmpty()) {
                try {
                    // Get original filename and extension
                    String originalFilename = image.getOriginalFilename();
                    String extension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }

                    // Generate unique filename
                    String filename = UUID.randomUUID().toString() + extension;
                    Path filePath = uploadPath.resolve(filename);

                    // Save the file
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    // Store the URL
                    String imageUrl = "/uploads/" + filename;
                    savedUrls.add(imageUrl);

                    System.out.println("Saved image: " + filename + " at " + filePath.toAbsolutePath());

                } catch (IOException e) {
                    System.err.println("Failed to save image: " + e.getMessage());
                    throw e;
                }
            }
        }

        return savedUrls;
    }

    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            String filename = imageUrl.substring(9);
            Path imagePath = Paths.get(uploadDir).resolve(filename);

            if (Files.exists(imagePath)) {
                Files.delete(imagePath);
                System.out.println("Deleted image: " + filename);
            } else {
                System.out.println("Image not found for deletion: " + filename);
            }
        }
    }
}