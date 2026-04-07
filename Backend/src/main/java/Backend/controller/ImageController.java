package Backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<?> serveImage(@PathVariable String filename) {
        try {
            // Clean the filename
            String cleanFilename = filename.replace("%20", " ").replaceAll("[^a-zA-Z0-9._-]", "");

            // Get the file path
            Path filePath = Paths.get(uploadDir).resolve(cleanFilename).normalize();
            File file = filePath.toFile();

            // Check if file exists
            if (file.exists() && file.isFile() && file.canRead()) {
                Resource resource = new UrlResource(filePath.toUri());

                if (resource.exists() && resource.isReadable()) {
                    String contentType = determineContentType(cleanFilename);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_TYPE, contentType)
                            .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                            .body(resource);
                }
            }

            // File not found - return a default placeholder image or 404
            System.out.println("Image not found: " + filePath.toString());
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            System.out.println("Error serving image: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error loading image");
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".png")) {
            return MediaType.IMAGE_PNG_VALUE;
        } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG_VALUE;
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return MediaType.IMAGE_GIF_VALUE;
        } else if (filename.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        }
        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
}