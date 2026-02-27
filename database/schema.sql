-- Create Alumni AI Database Schema
-- Run this script in your MySQL client

CREATE DATABASE IF NOT EXISTS alumni_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE alumni_ai_db;

-- Users Table (Students, Alumni, Admin)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role ENUM('student', 'alumni', 'admin') DEFAULT 'student',
    profile_pic VARCHAR(255),
    bio TEXT,
    phone VARCHAR(15),
    date_of_birth DATE,
    gender VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Students Table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    semester INT,
    cgpa DECIMAL(3,2),
    batch_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_branch (branch),
    INDEX idx_batch_year (batch_year)
);

-- Alumni Table
CREATE TABLE alumni (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    graduation_year INT,
    cgpa DECIMAL(3,2),
    current_company VARCHAR(200),
    current_position VARCHAR(100),
    current_location VARCHAR(150),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    years_experience INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_branch (branch),
