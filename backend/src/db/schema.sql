-- RamalTani PostgreSQL Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'farmer', -- 'farmer', 'extension_officer', 'admin'
  location VARCHAR(150),
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  commodity VARCHAR(100),
  land_size_ha NUMERIC(6, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  adm4_code VARCHAR(50),
  area_label VARCHAR(100),
  main_crops TEXT[],
  total_farmers INT DEFAULT 0,
  total_area_ha NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(150),
  category VARCHAR(50),
  optimal_rainfall_mm_min INT,
  optimal_rainfall_mm_max INT,
  optimal_temp_c_min NUMERIC(4, 1),
  optimal_temp_c_max NUMERIC(4, 1),
  growing_period_days INT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop Varieties table
CREATE TABLE IF NOT EXISTS varieties (
  id VARCHAR(50) PRIMARY KEY,
  crop_id VARCHAR(50) REFERENCES crops(id) ON DELETE CASCADE,
  crop_name VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  duration_days INT,
  potential_yield_ton_ha NUMERIC(4, 2),
  resistance TEXT[],
  description TEXT,
  recommended_season VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planting History table
CREATE TABLE IF NOT EXISTS planting_history (
  id VARCHAR(50) PRIMARY KEY,
  farmer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  planting_date DATE NOT NULL,
  harvest_date DATE,
  area_ha NUMERIC(6, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'planning', 'active', 'harvested', 'failed'
  yield_target_ton NUMERIC(6, 2),
  yield_actual_ton NUMERIC(6, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'alert', 'warning', 'info', 'recommendation'
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Alerts table
CREATE TABLE IF NOT EXISTS risk_alerts (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'rendah', 'waspada', 'bahaya'
  region_name VARCHAR(100) NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  action_advice TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150) NOT NULL,
  author_role VARCHAR(50) DEFAULT 'Petani',
  location VARCHAR(150),
  category VARCHAR(100) DEFAULT 'Tanya Jawab',
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id VARCHAR(50) PRIMARY KEY,
  post_id VARCHAR(50) REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education Articles table
CREATE TABLE IF NOT EXISTS education_articles (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  reading_time VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  published_date VARCHAR(50) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20) DEFAULT 'info',
  category VARCHAR(50),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
