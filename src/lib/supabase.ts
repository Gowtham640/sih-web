import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Coach {
  id: number
  username: string
  password: string
  name: string
  email: string
  specialization?: string
  created_at: string
  updated_at: string
}

export interface Athlete {
  id: number
  username: string
  password: string
  name: string
  email: string
  grade?: string
  sport?: string
  created_at: string
  updated_at: string
}

export interface Drill {
  id: number
  coach_id: number
  name: string
  goal: string
  instructions: string
  video_url?: string
  created_at: string
  updated_at: string
}

export interface CoachAthlete {
  id: number
  coach_id: number
  athlete_id: number
  created_at: string
}

export interface DrillAssignment {
  id: number
  coach_id: number
  athlete_id: number
  drill_id: number
  due_date?: string
  status: 'assigned' | 'completed' | 'submitted' | 'reviewed'
  custom_goal?: string
  score?: number
  feedback?: string
  submission_video_url?: string
  created_at: string
  updated_at: string
}
