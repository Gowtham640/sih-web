'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

interface AthleteStats {
  assignedDrills: number
  completedDrills: number
  pendingReview: number
  averageScore: number
}

export default function AthleteDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AthleteStats>({
    assignedDrills: 0,
    completedDrills: 0,
    pendingReview: 0,
    averageScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.type !== 'athlete') {
      router.push('/athlete/login')
      return
    }
    fetchDashboardStats()
  }, [user, router])

      const fetchDashboardStats = async () => {
    if (!user) return

    try {
      // Fetch drill assignments for this athlete
      const { data: assignments } = await supabase
        .from('drill_assignments')
        .select('status, score')
        .eq('athlete_id', user.id)

      const assignedCount = assignments?.length || 0
      const completedCount = assignments?.filter(a => a.status === 'completed' || a.status === 'reviewed').length || 0
      const pendingCount = assignments?.filter(a => a.status === 'submitted').length || 0

      // Calculate average score from reviewed assignments
      const reviewedAssignments = assignments?.filter(a => a.score !== null) || []
      const averageScore = reviewedAssignments.length > 0
        ? Math.round(reviewedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / reviewedAssignments.length)
        : 0

      setStats({
        assignedDrills: assignedCount,
        completedDrills: completedCount,
        pendingReview: pendingCount,
        averageScore
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

  if (!user || user.type !== 'athlete') {
    return null
  }

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Gradient Header */}
      <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-32 flex items-center justify-center shadow-xl">
        <p className='absolute text-white font-sans font-bold text-6xl'>Athlete Dashboard</p>
        <div className="absolute right-6 flex gap-4 items-center">
          <span className="text-white font-medium">Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            className="font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
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
                    <p className="text-purple-100 text-sm font-medium">Assigned Drills</p>
                    <p className="text-3xl font-bold">{stats.assignedDrills}</p>
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
                    <p className="text-blue-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold">{stats.completedDrills}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Pending Review</p>
                    <p className="text-3xl font-bold">{stats.pendingReview}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Average Score</p>
                    <p className="text-3xl font-bold">{stats.averageScore}%</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
            {/* Card 1 - Assigned Drills */}
            <div className="relative bg-white border-4 border-gray-200 rounded-lg h-[50vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col transform hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-600/30 to-transparent blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-500/20 to-transparent blur-md"></div>
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-lg"></div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-sans font-bold mb-6 text-xl text-center">
                    View all drills assigned by your coach
                  </h3>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
                    <p className="text-purple-800 text-xs font-medium text-center">
                      📚 View assigned drills, instructions, and due dates
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/athlete/drills')} className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-auto">
                  Assigned Drills
                </button>
              </div>
            </div>

            {/* Card 2 - Complete Drill */}
            <div className="relative bg-white border-4 border-gray-200 rounded-lg h-[50vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col transform hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600/30 to-transparent blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-purple-500/20 to-transparent blur-md"></div>
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-lg"></div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-sans font-bold mb-6 text-xl text-center">
                    Record and submit your drill performance
                  </h3>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-xs font-medium text-center">
                      🎥 Record your performance and submit for review
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/athlete/submit')} className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-auto">
                  Complete Drill
                </button>
              </div>
            </div>

            {/* Card 3 - Reports */}
            <div className="relative bg-white border-4 border-gray-200 rounded-lg h-[50vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col transform hover:scale-105 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-green-600/30 to-transparent blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-500/20 to-transparent blur-md"></div>
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-lg"></div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-800 font-sans font-bold mb-6 text-xl text-center">
                    View your progress reports and feedback
                  </h3>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-xs font-medium text-center">
                      📊 Check your scores, feedback, and progress
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/athlete/report')} className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-auto">
                  Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
