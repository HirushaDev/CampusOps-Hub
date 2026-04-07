package Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private Integer capacity;
    private String location;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "resource_amenities", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "resource_features", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "resource_images", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "image_url", length = 500)
    private List<String> images = new ArrayList<>();

    private String status = "ACTIVE";
    private String contactPerson;
    private String contactEmail;
    private String rules;
    private Double pricePerHour = 0.0;
    private Double rating = 0.0;
    private Integer reviewCount = 0;
    private Boolean isPopular = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Resource() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public Integer getCapacity() { return capacity; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public List<String> getAmenities() { return amenities; }
    public List<String> getFeatures() { return features; }
    public List<String> getImages() { return images; }
    public String getStatus() { return status; }
    public String getContactPerson() { return contactPerson; }
    public String getContactEmail() { return contactEmail; }
    public String getRules() { return rules; }
    public Double getPricePerHour() { return pricePerHour; }
    public Double getRating() { return rating; }
    public Integer getReviewCount() { return reviewCount; }
    public Boolean getIsPopular() { return isPopular; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public void setFeatures(List<String> features) { this.features = features; }
    public void setImages(List<String> images) { this.images = images; }
    public void setStatus(String status) { this.status = status; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public void setRules(String rules) { this.rules = rules; }
    public void setPricePerHour(Double pricePerHour) { this.pricePerHour = pricePerHour; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}