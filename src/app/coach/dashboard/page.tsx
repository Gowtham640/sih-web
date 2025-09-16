'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

interface DashboardStats {
  totalDrills: number
  activeAthletes: number
  completedAssignments: number
  pendingAssignments: number
}

export default function CoachDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalDrills: 0,
    activeAthletes: 0,
    completedAssignments: 0,
    pendingAssignments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.type !== 'coach') {
      router.push('/coach/login')
      return
    }
    fetchDashboardStats()
  }, [user, router])

  const fetchDashboardStats = async () => {
    if (!user) return

    try {
      // Fetch total drills created by coach
      const { data: drills } = await supabase
        .from('drills')
        .select('id')
        .eq('coach_id', user.id)

      // Fetch active athletes under this coach
      const { data: athletes } = await supabase
        .from('coach_athletes')
        .select('athlete_id')
        .eq('coach_id', user.id)

      // Fetch drill assignments stats
      const { data: assignments } = await supabase
        .from('drill_assignments')
        .select('status')
        .eq('coach_id', user.id)

      const completedCount = assignments?.filter(a => a.status === 'completed' || a.status === 'reviewed').length || 0
      const pendingCount = assignments?.filter(a => a.status === 'assigned' || a.status === 'submitted').length || 0

      setStats({
        totalDrills: drills?.length || 0,
        activeAthletes: athletes?.length || 0,
        completedAssignments: completedCount,
        pendingAssignments: pendingCount
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user || user.type !== 'coach') {
    return null
  }

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Gradient Header */}
      <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-32 flex items-center justify-center">
        <p className='absolute text-white font-sans font-bold text-6xl'>Coach Dashboard</p>
        <div className="absolute right-6 flex gap-4">
          <span className="text-white font-medium">Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            className="font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white px-8 py-6 flex justify-center">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 max-w-5xl w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Overview</h2>
          {loading ? (
            <div className="text-center">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stat Card 1 */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Drills</p>
                    <p className="text-3xl font-bold">{stats.totalDrills}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Active Athletes</p>
                    <p className="text-3xl font-bold">{stats.activeAthletes}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold">{stats.completedAssignments}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold">{stats.pendingAssignments}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white h-auto px-8 py-8 flex justify-center">
        <div className="bg-gray-50 rounded-2xl p-8 max-w-7xl w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Upload Video */}
            <div className="relative bg-white border-4 border-gray-200 rounded-lg h-[50vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between transform hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-600/30 to-transparent blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-500/20 to-transparent blur-md"></div>
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-lg"></div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011 1v18a1 1 0 01-1 1H6a1 1 0 01-1-1V2a1 1 0 011-1h8v2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-sans font-bold mb-6 text-xl text-center">
                    Create and upload reference exercise videos and drills
                  </h3>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
                    <p className="text-purple-800 text-xs font-medium text-center">
                      💡 Upload videos, set goals, and create detailed instructions for each drill
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/coach/upload')} className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-auto">
                  Create Drill
                </button>
              </div>
            </div>

            {/* Card 2 - Assign Drills */}
            <div className="relative bg-white border-4 border-gray-200 rounded-lg h-[50vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between transform hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600/30 to-transparent blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-purple-500/20 to-transparent blur-md"></div>
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-lg"></div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-sans font-bold mb-6 text-xl text-center">
                    Assign drills to athletes with specific goals
                  </h3>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-xs font-medium text-center">
                      🎯 Set custom goals, deadlines, and track athlete progress
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/coach/assign')} className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-auto">
                  Assign Drills
                </button>
              </div>
            </div>

            {/* Card 3 - Review Progress */}
            <div className="relative bg-white border-4 border-gray-200 rounded-lg h-[50vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between transform hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-green-600/30 to-transparent blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-500/20 to-transparent blur-md"></div>
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-lg"></div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-sans font-bold mb-6 text-xl text-center">
                    Review athlete progress and submitted drill videos
                  </h3>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-xs font-medium text-center">
                      📊 Review submissions, provide feedback, and track improvements
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/coach/review')} className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-auto">
                  Review Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
