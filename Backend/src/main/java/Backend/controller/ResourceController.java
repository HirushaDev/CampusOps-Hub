package Backend.controller;

import Backend.model.Resource;
import Backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveResources() {
        List<Resource> resources = resourceService.getActiveResources();
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        if (resource == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Resource not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceService.convertToMap(resource));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Map<String, Object>> getResourcesByType(@PathVariable String type) {
        List<Resource> resources = resourceService.getResourcesByType(type);
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResources(@RequestParam String keyword) {
        List<Resource> resources = resourceService.searchResources(keyword);
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularResources() {
        List<Resource> resources = resourceService.getPopularResources();
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createResource(
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("capacity") Integer capacity,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam(value = "amenities", required = false) String amenities,
            @RequestParam(value = "features", required = false) String features,
            @RequestParam(value = "contactPerson", required = false) String contactPerson,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "rules", required = false) String rules,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) throws IOException {

        Map<String, Object> resourceData = new HashMap<>();
        resourceData.put("name", name);
        resourceData.put("type", type);
        resourceData.put("capacity", capacity);
        resourceData.put("location", location);
        resourceData.put("description", description);
        resourceData.put("amenities", amenities);
        resourceData.put("features", features);
        resourceData.put("contactPerson", contactPerson);
        resourceData.put("contactEmail", contactEmail);
        resourceData.put("rules", rules);

        Resource resource = resourceService.createResource(resourceData, images);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Resource created successfully");
        response.put("data", resourceService.convertToMap(resource));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // FIXED: PUT endpoint for updating resource
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateResource(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("capacity") Integer capacity,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam(value = "amenities", required = false) String amenities,
            @RequestParam(value = "features", required = false) String features,
            @RequestParam(value = "contactPerson", required = false) String contactPerson,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "rules", required = false) String rules,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) throws IOException {

        System.out.println("Updating resource with ID: " + id);
        System.out.println("Name: " + name);
        System.out.println("Type: " + type);
        System.out.println("Capacity: " + capacity);
        System.out.println("Location: " + location);
        System.out.println("Status: " + status);

        Map<String, Object> resourceData = new HashMap<>();
        resourceData.put("name", name);
        resourceData.put("type", type);
        resourceData.put("capacity", capacity);
        resourceData.put("location", location);
        resourceData.put("description", description);
        resourceData.put("amenities", amenities);
        resourceData.put("features", features);
        resourceData.put("contactPerson", contactPerson);
        resourceData.put("contactEmail", contactEmail);
        resourceData.put("rules", rules);
        resourceData.put("status", status != null ? status : "ACTIVE");

        Resource resource = resourceService.updateResource(id, resourceData, images);

        if (resource == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Resource not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Resource updated successfully");
        response.put("data", resourceService.convertToMap(resource));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id) throws IOException {
        boolean deleted = resourceService.deleteResource(id);

        if (!deleted) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Resource not found or could not be deleted");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Resource deleted successfully");
        return ResponseEntity.ok(response);
    }
}