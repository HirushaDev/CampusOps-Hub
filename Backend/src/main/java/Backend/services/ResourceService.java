package Backend.service;

import Backend.model.Booking;
import Backend.model.Resource;
import Backend.repository.BookingRepository;
import Backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getActiveResources() {
        return resourceRepository.findByStatus("ACTIVE");
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    public List<Resource> searchResources(String keyword) {
        return resourceRepository.searchByKeyword(keyword);
    }

    public List<Resource> getPopularResources() {
        return resourceRepository.findByIsPopularTrue();
    }

    public Resource createResource(Map<String, Object> resourceData, List<MultipartFile> images) throws IOException {
        Resource resource = new Resource();

        resource.setName((String) resourceData.get("name"));
        resource.setType((String) resourceData.get("type"));
        resource.setCapacity(Integer.parseInt(resourceData.get("capacity").toString()));
        resource.setLocation((String) resourceData.get("location"));
        resource.setDescription((String) resourceData.get("description"));

        // Handle amenities
        Object amenitiesObj = resourceData.get("amenities");
        if (amenitiesObj instanceof String && !((String) amenitiesObj).isEmpty()) {
            List<String> amenities = new ArrayList<>();
            for (String a : ((String) amenitiesObj).split(",")) {
                amenities.add(a.trim());
            }
            resource.setAmenities(amenities);
        }

        // Handle features
        Object featuresObj = resourceData.get("features");
        if (featuresObj instanceof String && !((String) featuresObj).isEmpty()) {
            List<String> features = new ArrayList<>();
            for (String f : ((String) featuresObj).split(",")) {
                features.add(f.trim());
            }
            resource.setFeatures(features);
        }

        resource.setContactPerson((String) resourceData.get("contactPerson"));
        resource.setContactEmail((String) resourceData.get("contactEmail"));
        resource.setRules((String) resourceData.get("rules"));

        if (resourceData.get("pricePerHour") != null) {
            resource.setPricePerHour(Double.parseDouble(resourceData.get("pricePerHour").toString()));
        }

        // Save images
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = saveImages(images);
            resource.setImages(imageUrls);
        }

        resource.setCreatedAt(LocalDateTime.now());
        resource.setUpdatedAt(LocalDateTime.now());

        return resourceRepository.save(resource);
    }

    // FIXED: Update resource method
    public Resource updateResource(Long id, Map<String, Object> resourceData, List<MultipartFile> newImages) throws IOException {
        Resource resource = getResourceById(id);
        if (resource == null) return null;

        System.out.println("Updating resource: " + resource.getName());

        // Update basic fields
        if (resourceData.containsKey("name")) {
            resource.setName((String) resourceData.get("name"));
        }
        if (resourceData.containsKey("type")) {
            resource.setType((String) resourceData.get("type"));
        }
        if (resourceData.containsKey("capacity")) {
            resource.setCapacity(Integer.parseInt(resourceData.get("capacity").toString()));
        }
        if (resourceData.containsKey("location")) {
            resource.setLocation((String) resourceData.get("location"));
        }
        if (resourceData.containsKey("description")) {
            resource.setDescription((String) resourceData.get("description"));
        }
        if (resourceData.containsKey("contactPerson")) {
            resource.setContactPerson((String) resourceData.get("contactPerson"));
        }
        if (resourceData.containsKey("contactEmail")) {
            resource.setContactEmail((String) resourceData.get("contactEmail"));
        }
        if (resourceData.containsKey("rules")) {
            resource.setRules((String) resourceData.get("rules"));
        }
        if (resourceData.containsKey("status")) {
            resource.setStatus((String) resourceData.get("status"));
        }

        // Update amenities
        if (resourceData.containsKey("amenities")) {
            String amenitiesStr = (String) resourceData.get("amenities");
            List<String> amenities = new ArrayList<>();
            if (amenitiesStr != null && !amenitiesStr.isEmpty()) {
                for (String a : amenitiesStr.split(",")) {
                    amenities.add(a.trim());
                }
            }
            resource.setAmenities(amenities);
        }

        // Update features
        if (resourceData.containsKey("features")) {
            String featuresStr = (String) resourceData.get("features");
            List<String> features = new ArrayList<>();
            if (featuresStr != null && !featuresStr.isEmpty()) {
                for (String f : featuresStr.split(",")) {
                    features.add(f.trim());
                }
            }
            resource.setFeatures(features);
        }

        // Add new images (keep existing ones)
        if (newImages != null && !newImages.isEmpty()) {
            List<String> newImageUrls = saveImages(newImages);
            List<String> currentImages = resource.getImages();
            if (currentImages == null) {
                currentImages = new ArrayList<>();
            }
            currentImages.addAll(newImageUrls);
            resource.setImages(currentImages);
        }

        resource.setUpdatedAt(LocalDateTime.now());

        Resource savedResource = resourceRepository.save(resource);
        System.out.println("Resource updated successfully: " + savedResource.getName());

        return savedResource;
    }

    // FIXED: Delete resource with cascade
    @Transactional
    public boolean deleteResource(Long id) {
        try {
            Resource resource = getResourceById(id);
            if (resource == null) {
                System.out.println("Resource not found with id: " + id);
                return false;
            }

            System.out.println("Deleting resource: " + resource.getName() + " (ID: " + id + ")");

            // First, delete all associated bookings
            List<Booking> bookings = bookingRepository.findByResource(resource);
            if (!bookings.isEmpty()) {
                System.out.println("Deleting " + bookings.size() + " associated bookings");
                bookingRepository.deleteAll(bookings);
            }

            // Delete image files
            if (resource.getImages() != null && !resource.getImages().isEmpty()) {
                for (String imageUrl : resource.getImages()) {
                    try {
                        String filename = imageUrl.replace("/uploads/", "");
                        Path imagePath = Paths.get(uploadDir).resolve(filename);
                        if (Files.exists(imagePath)) {
                            Files.delete(imagePath);
                            System.out.println("Deleted image: " + filename);
                        }
                    } catch (IOException e) {
                        System.err.println("Could not delete image: " + e.getMessage());
                    }
                }
            }

            // Finally, delete the resource
            resourceRepository.delete(resource);
            System.out.println("Resource deleted successfully");
            return true;

        } catch (Exception e) {
            System.err.println("Error deleting resource: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> savedUrls = new ArrayList<>();
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String originalFilename = image.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String filename = UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(filename);
                Files.copy(image.getInputStream(), filePath);
                savedUrls.add("/uploads/" + filename);
                System.out.println("Saved image: " + filename);
            }
        }

        return savedUrls;
    }

    public Map<String, Object> convertToMap(Resource resource) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", resource.getId());
        map.put("name", resource.getName());
        map.put("type", resource.getType());
        map.put("capacity", resource.getCapacity());
        map.put("location", resource.getLocation());
        map.put("description", resource.getDescription());
        map.put("amenities", resource.getAmenities());
        map.put("features", resource.getFeatures());
        map.put("images", resource.getImages());
        map.put("status", resource.getStatus());
        map.put("contactPerson", resource.getContactPerson());
        map.put("contactEmail", resource.getContactEmail());
        map.put("rules", resource.getRules());
        map.put("pricePerHour", resource.getPricePerHour());
        map.put("rating", resource.getRating());
        map.put("reviewCount", resource.getReviewCount());
        map.put("isPopular", resource.getIsPopular());
        map.put("createdAt", resource.getCreatedAt());
        map.put("updatedAt", resource.getUpdatedAt());
        return map;
    }
}