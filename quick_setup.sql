-- QUICK SETUP FOR SPORTS TRAINING PLATFORM
-- Copy and paste this entire script into your Supabase SQL Editor

-- 1. Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create athletes table
CREATE TABLE IF NOT EXISTS athletes (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    grade VARCHAR(20),
    sport VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert test coaches
INSERT INTO coaches (username, password, name, email, specialization) VALUES
('coach1', 'password123', 'Rajesh Kumar', 'rajesh.kumar@sportsclub.com', 'Cricket'),
('coach2', 'password123', 'Priya Sharma', 'priya.sharma@sportsclub.com', 'Badminton'),
('coach3', 'password123', 'Vikram Singh', 'vikram.singh@sportsclub.com', 'Football')
ON CONFLICT (username) DO NOTHING;

-- 4. Insert test athletes
INSERT INTO athletes (username, password, name, email, grade, sport) VALUES
('athlete1', 'password123', 'Arjun Sharma', 'arjun.sharma@student.com', '10th', 'Cricket'),
('athlete2', 'password123', 'Priya Patel', 'priya.patel@student.com', '11th', 'Badminton'),
('athlete3', 'password123', 'Rahul Kumar', 'rahul.kumar@student.com', '9th', 'Football'),
('athlete4', 'password123', 'Sneha Singh', 'sneha.singh@student.com', '12th', 'Swimming'),
('athlete5', 'password123', 'Vikram Reddy', 'vikram.reddy@student.com', '10th', 'Athletics')
ON CONFLICT (username) DO NOTHING;

-- 5. Enable RLS (Row Level Security) and create basic policies
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (you can tighten these later)
CREATE POLICY IF NOT EXISTS "Allow all access to coaches" ON coaches USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow all access to athletes" ON athletes USING (true) WITH CHECK (true);

-- 6. Verify setup
SELECT 'Setup Complete!' as status,
       (SELECT COUNT(*) FROM coaches) as coaches_count,
       (SELECT COUNT(*) FROM athletes) as athletes_count;
