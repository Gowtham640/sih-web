import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Coach {
  id: number
  username: string
  password: string
  name: string
  email?: string
  created_at: string
}

export interface Athlete {
  id: number
  username: string
  password: string
  name: string
  email?: string
  created_at: string
}

export interface Drill {
  id: number
  coach_id: number
  name: string
  goal?: string
  instructions?: string
  video_url?: string
  created_at: string
}

export interface CoachAthlete {
  id: number
  coach_id: number
  athlete_id: number
  assigned_at: string
}

export interface DrillAssignment {
  id: number
  drill_id: number
  athlete_id: number
  assigned_by: number
  assigned_at: string
  due_date?: string
  status: 'pending' | 'completed' | 'reviewed'
}
