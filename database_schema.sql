-- Sports Training Platform Database Schema
-- Run this in your Supabase SQL editor

-- Create coaches table
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create athletes table
CREATE TABLE athletes (
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

-- Create drills table
CREATE TABLE drills (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    goal TEXT NOT NULL,
    instructions TEXT NOT NULL,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coach_athletes relationship table (for coaches to manage their athletes)
CREATE TABLE coach_athletes (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coach_id, athlete_id)
);

-- Create drill assignments table
CREATE TABLE drill_assignments (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
    drill_id INTEGER REFERENCES drills(id) ON DELETE CASCADE,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'completed', 'submitted', 'reviewed')),
    custom_goal TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    submission_video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample coaches
INSERT INTO coaches (username, password, name, email, specialization) VALUES
('coach1', 'password123', 'Rajesh Kumar', 'rajesh.kumar@sportsclub.com', 'Cricket'),
('coach2', 'password123', 'Priya Sharma', 'priya.sharma@sportsclub.com', 'Badminton'),
('coach3', 'password123', 'Vikram Singh', 'vikram.singh@sportsclub.com', 'Football');

-- Insert sample athletes
INSERT INTO athletes (username, password, name, email, grade, sport) VALUES
('athlete1', 'password123', 'Arjun Sharma', 'arjun.sharma@student.com', '10th', 'Cricket'),
('athlete2', 'password123', 'Priya Patel', 'priya.patel@student.com', '11th', 'Badminton'),
('athlete3', 'password123', 'Rahul Kumar', 'rahul.kumar@student.com', '9th', 'Football'),
('athlete4', 'password123', 'Sneha Singh', 'sneha.singh@student.com', '12th', 'Swimming'),
('athlete5', 'password123', 'Vikram Reddy', 'vikram.reddy@student.com', '10th', 'Athletics'),
('athlete6', 'password123', 'Ananya Gupta', 'ananya.gupta@student.com', '11th', 'Tennis'),
('athlete7', 'password123', 'Karthik Nair', 'karthik.nair@student.com', '9th', 'Basketball'),
('athlete8', 'password123', 'Meera Joshi', 'meera.joshi@student.com', '12th', 'Volleyball');

-- Sample coach-athlete assignments
INSERT INTO coach_athletes (coach_id, athlete_id) VALUES
-- Coach 1 (Cricket) - manages athletes 1, 3, 5
(1, 1), (1, 3), (1, 5),
-- Coach 2 (Badminton) - manages athletes 2, 4, 6
(2, 2), (2, 4), (2, 6),
-- Coach 3 (Football) - manages athletes 7, 8
(3, 7), (3, 8);

-- Sample drills for each coach
INSERT INTO drills (coach_id, name, goal, instructions, video_url) VALUES
-- Coach 1 drills
(1, 'Cricket Batting Practice', 'Improve batting technique and timing', 'Practice straight drive shots for 30 minutes. Focus on elbow position and follow-through.', NULL),
(1, 'Cricket Bowling Accuracy', 'Enhance bowling precision', 'Bowl 50 deliveries targeting the wicket. Maintain consistent line and length.', NULL),
-- Coach 2 drills
(2, 'Badminton Footwork', 'Enhance court movement and agility', 'Practice shadow badminton for 20 minutes focusing on quick directional changes.', NULL),
(2, 'Badminton Serve Practice', 'Perfect serve accuracy and power', 'Practice 100 serves alternating between long and short serves.', NULL),
-- Coach 3 drills
(3, 'Football Dribbling', 'Master ball control and dribbling', 'Dribble through cone setup for 15 minutes maintaining close ball control.', NULL),
(3, 'Football Shooting Practice', 'Improve shooting accuracy', 'Take 50 shots from different angles focusing on placement over power.', NULL);

-- Create indexes for better performance
CREATE INDEX idx_drills_coach_id ON drills(coach_id);
CREATE INDEX idx_drill_assignments_athlete_id ON drill_assignments(athlete_id);
CREATE INDEX idx_drill_assignments_coach_id ON drill_assignments(coach_id);
CREATE INDEX idx_coach_athletes_coach_id ON coach_athletes(coach_id);
CREATE INDEX idx_coach_athletes_athlete_id ON coach_athletes(athlete_id);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at fields
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drills_updated_at BEFORE UPDATE ON drills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drill_assignments_updated_at BEFORE UPDATE ON drill_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
