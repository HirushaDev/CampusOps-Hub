-- University Event Management System Database Schema
-- MySQL Database Script

-- Create database
CREATE DATABASE IF NOT EXISTS university_events_db;
USE university_events_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ORGANIZER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT,
    date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_date (date),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    status ENUM('BOOKED', 'CANCELLED') NOT NULL DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_event (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Club_Members table
CREATE TABLE IF NOT EXISTS club_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    club_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_club (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_club (club_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    message LONGTEXT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_event (event_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
-- Sample Users
INSERT INTO users (name, email, password, role) VALUES
('John Student', 'john@student.com', '$2a$10$slYQmyNdGzin7olVN3/p2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm2', 'STUDENT'),
('Alice Organizer', 'alice@organizer.com', '$2a$10$slYQmyNdGzin7olVN3/p2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm2', 'ORGANIZER'),
('Sarah Student', 'sarah@student.com', '$2a$10$slYQmyNdGzin7olVN3/p2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm2', 'STUDENT'),
('Bob Organizer', 'bob@organizer.com', '$2a$10$slYQmyNdGzin7olVN3/p2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm2', 'ORGANIZER'),
('Emma Student', 'emma@student.com', '$2a$10$slYQmyNdGzin7olVN3/p2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm2', 'STUDENT');

-- Sample Events
INSERT INTO events (name, description, date, location, total_seats, available_seats) VALUES
('Tech Conference 2024', 'Annual technology conference featuring latest innovations', '2024-04-15 10:00:00', 'Main Auditorium', 500, 450),
('Sports Day', 'University sports day with various competitions', '2024-05-20 08:00:00', 'Sports Ground', 1000, 800),
('Cultural Festival', 'Celebration of diverse cultures with performances and food', '2024-06-10 18:00:00', 'Open Ground', 2000, 1500),
('Workshop on AI', 'Hands-on workshop introducing artificial intelligence basics', '2024-04-25 14:00:00', 'Lab Block', 100, 85),
('Coding Bootcamp', 'Intensive coding bootcamp for students', '2024-05-05 09:00:00', 'Computer Lab', 80, 60);

-- Sample Clubs
INSERT INTO clubs (name, description) VALUES
('Coding Club', 'A club for programming enthusiasts to share and learn coding'),
('Sports Club', 'For students interested in sports and fitness activities'),
('Photography Club', 'Explore the art of photography and visual storytelling'),
('Music Club', 'Platform for music lovers to perform and enjoy music'),
('Debate Society', 'Forum for intellectual discussions and debates'),
('Art & Design Club', 'Creative space for artists and designers');

-- Sample Bookings
INSERT INTO bookings (user_id, event_id, status) VALUES
(1, 1, 'BOOKED'),
(1, 2, 'BOOKED'),
(3, 1, 'BOOKED'),
(3, 4, 'CANCELLED'),
(5, 3, 'BOOKED');

-- Sample Club Members
INSERT INTO club_members (user_id, club_id) VALUES
(1, 1),
(1, 2),
(3, 1),
(3, 4),
(5, 2),
(5, 6);

-- Sample Feedback
INSERT INTO feedback (user_id, event_id, message, rating) VALUES
(1, 1, 'Amazing event! Very informative and well organized.', 5),
(3, 1, 'Great speakers and excellent venue.', 4),
(3, 4, 'The workshop was very helpful for learning AI basics.', 5),
(5, 3, 'Had a great time at the cultural festival!', 4);
