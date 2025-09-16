import { supabase } from './supabase'
import type { Coach, Athlete } from './supabase'

export interface AuthUser {
  id: number
  username: string
  name: string
  email: string
  type: 'coach' | 'athlete'
  specialization?: string
  grade?: string
  sport?: string
}

export const authService = {
  // Login function for coaches
  async loginCoach(username: string, password: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !data) {
        return null
      }

              return {
          id: data.id,
          username: data.username,
          name: data.name,
          email: data.email,
          type: 'coach',
          specialization: data.specialization
        }
    } catch (error) {
      console.error('Coach login error:', error)
      return null
    }
  },

  // Login function for athletes
  async loginAthlete(username: string, password: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !data) {
        return null
      }

              return {
          id: data.id,
          username: data.username,
          name: data.name,
          email: data.email,
          type: 'athlete',
          grade: data.grade,
          sport: data.sport
        }
    } catch (error) {
      console.error('Athlete login error:', error)
      return null
    }
  },

  // Store user session in localStorage
  setUserSession(user: AuthUser) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Get user session from localStorage
  getUserSession(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      return null
    }
  },

  // Clear user session
  logout() {
    localStorage.removeItem('user')
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getUserSession() !== null
  }
}
