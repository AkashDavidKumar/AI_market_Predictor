-- Database Creation
CREATE DATABASE IF NOT EXISTS farm_ai;
USE farm_ai;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    season VARCHAR(50),
    profitability INT DEFAULT 0,
    INDEX idx_crop_name (name)
);

-- 3. Markets Table
CREATE TABLE IF NOT EXISTS markets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100),
    INDEX idx_market_name (name)
);

-- 4. Market Prices Table (Historical and current prices)
CREATE TABLE IF NOT EXISTS market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    market VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    price FLOAT NOT NULL,
    rainfall FLOAT,
    temperature FLOAT,
    season VARCHAR(50),
    FOREIGN KEY (crop_name) REFERENCES crops(name) ON DELETE CASCADE,
    FOREIGN KEY (market) REFERENCES markets(name) ON DELETE CASCADE,
    INDEX idx_price_date (date),
    INDEX idx_price_crop (crop_name)
);

-- 5. Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    crop_name VARCHAR(100) NOT NULL,
    market VARCHAR(100) NOT NULL,
    predicted_date DATE NOT NULL,
    predicted_price FLOAT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (crop_name) REFERENCES crops(name) ON DELETE CASCADE,
    FOREIGN KEY (market) REFERENCES markets(name) ON DELETE CASCADE
);

-- 6. Price Alerts Table
CREATE TABLE IF NOT EXISTS price_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    target_price FLOAT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_name) REFERENCES crops(name) ON DELETE CASCADE
);

-- ==========================================
-- Insert Sample/Dummy Data
-- ==========================================

-- Insert Users
INSERT IGNORE INTO users (username, email, password_hash) VALUES 
('admin', 'admin@farmai.com', 'hashedpassword123'),
('farmer_john', 'john@example.com', 'hashedpassword456');

-- Insert Crops
INSERT IGNORE INTO crops (name, season, profitability) VALUES 
('Wheat', 'Rabi', 72),
('Soybean', 'Kharif', 88),
('Cotton', 'Kharif', 78),
('Rice', 'Kharif', 65),
('Maize', 'Kharif', 60),
('Sugarcane', 'Annual', 74);

-- Insert Markets
INSERT IGNORE INTO markets (name, location) VALUES 
('Nagpur', 'Maharashtra'),
('Indore', 'Madhya Pradesh'),
('Delhi', 'Delhi'),
('Mumbai', 'Maharashtra'),
('Kolkata', 'West Bengal'),
('Pune', 'Maharashtra');

-- Insert Market Prices
INSERT IGNORE INTO market_prices (crop_name, market, date, price, rainfall, temperature, season) VALUES 
('Wheat', 'Nagpur', CURRENT_DATE(), 2420, 10.5, 28.0, 'Rabi'),
('Wheat', 'Delhi', CURRENT_DATE() - INTERVAL 1 DAY, 2350, 12.0, 26.5, 'Rabi'),
('Soybean', 'Indore', CURRENT_DATE(), 4500, 150.0, 30.0, 'Kharif'),
('Cotton', 'Nagpur', CURRENT_DATE(), 6200, 200.0, 32.0, 'Kharif'),
('Rice', 'Kolkata', CURRENT_DATE(), 1950, 300.0, 29.0, 'Kharif'),
('Maize', 'Mumbai', CURRENT_DATE(), 1750, 250.0, 31.0, 'Kharif');

-- Insert Price Alerts
INSERT IGNORE INTO price_alerts (user_id, crop_name, target_price, is_active) VALUES 
(1, 'Wheat', 2400, TRUE),
(1, 'Soybean', 4800, TRUE);
