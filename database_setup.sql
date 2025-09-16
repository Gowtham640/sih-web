-- Sports Training Hub Database Schema
-- Execute this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create coaches table
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create athletes table
CREATE TABLE athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drills table
CREATE TABLE drills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    goal TEXT NOT NULL,
    instructions TEXT NOT NULL,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drill_assignments table to track which drills are assigned to which athletes
CREATE TABLE drill_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drill_id UUID NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(drill_id, athlete_id)
);

-- Create athlete_submissions table for athlete drill submissions
CREATE TABLE athlete_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES drill_assignments(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    video_url TEXT,
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    reviewed_by UUID REFERENCES coaches(id),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Insert sample coaches with plain text passwords (you can hash them later)
INSERT INTO coaches (username, password, name, email) VALUES
('coach1', 'password123', 'John Smith', 'john.smith@example.com'),
('coach2', 'password123', 'Sarah Johnson', 'sarah.johnson@example.com'),
('coach3', 'password123', 'Mike Davis', 'mike.davis@example.com');

-- Insert sample athletes
INSERT INTO athletes (username, password, name, email) VALUES
('athlete1', 'password123', 'Alex Thompson', 'alex.thompson@example.com'),
('athlete2', 'password123', 'Emma Wilson', 'emma.wilson@example.com'),
('athlete3', 'password123', 'James Brown', 'james.brown@example.com'),
('athlete4', 'password123', 'Sophia Garcia', 'sophia.garcia@example.com'),
('athlete5', 'password123', 'Noah Johnson', 'noah.johnson@example.com'),
('athlete6', 'password123', 'Olivia Martinez', 'olivia.martinez@example.com'),
('athlete7', 'password123', 'Liam Anderson', 'liam.anderson@example.com'),
('athlete8', 'password123', 'Ava Taylor', 'ava.taylor@example.com');

-- Create storage bucket for drill videos (execute separately in storage section)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('drill-videos', 'drill-videos', true);

-- Enable Row Level Security
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these based on your security requirements)
CREATE POLICY "Allow public read access on coaches" ON coaches FOR SELECT USING (true);
CREATE POLICY "Allow public read access on athletes" ON athletes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on drills" ON drills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on drill_assignments" ON drill_assignments FOR SELECT USING (true);
CREATE POLICY "Allow public read access on athlete_submissions" ON athlete_submissions FOR SELECT USING (true);

CREATE POLICY "Allow public insert on drills" ON drills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on drill_assignments" ON drill_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on athlete_submissions" ON athlete_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on athletes" ON athletes FOR UPDATE USING (true);
CREATE POLICY "Allow public update on drill_assignments" ON drill_assignments FOR UPDATE USING (true);
CREATE POLICY "Allow public update on athlete_submissions" ON athlete_submissions FOR UPDATE USING (true);
