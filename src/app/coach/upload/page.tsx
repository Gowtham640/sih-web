'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

export default function DrillUploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    instructions: '',
    videoFile: null as File | null
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user || user.type !== 'coach') {
      router.push('/coach/login')
      return
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        videoFile: file
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !formData.name || !formData.goal || !formData.instructions) {
      alert('Please fill in all required fields')
      return
    }

    setUploading(true)

    try {
      let videoUrl = null

      // Upload video if provided
      if (formData.videoFile) {
        const fileExt = formData.videoFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('drill-videos')
          .upload(fileName, formData.videoFile)

        if (uploadError) {
          console.error('Video upload error:', uploadError)
          // Continue without video for now
        } else {
          const { data: urlData } = supabase.storage
            .from('drill-videos')
            .getPublicUrl(fileName)
          videoUrl = urlData.publicUrl
        }
      }

      // Create drill record
      const { error: drillError } = await supabase
        .from('drills')
        .insert({
          coach_id: user.id,
          name: formData.name,
          goal: formData.goal,
          instructions: formData.instructions,
          video_url: videoUrl
        })

      if (drillError) throw drillError

      alert('Drill created successfully!')
      router.push('/coach/dashboard')
    } catch (error) {
      console.error('Error creating drill:', error)
      alert('Failed to create drill. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (!user || user.type !== 'coach') {
    return null
  }

  return (
    <div className='bg-white w-full min-h-screen'>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-32 flex items-center justify-center">
        <p className='absolute text-white font-sans font-bold text-5xl'>Create New Drill</p>
        <button
          onClick={() => router.push('/coach/dashboard')}
          className="absolute right-6 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Form */}
      <div className="bg-white px-8 py-8 flex justify-center">
        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-xl p-8 max-w-4xl w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drill Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Drill Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Cricket Batting Practice"
              />
            </div>

            {/* Goal */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                Drill Goal *
              </label>
              <input
                type="text"
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Improve batting technique and timing"
              />
            </div>

            {/* Instructions */}
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Instructions *
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Provide step-by-step instructions for the drill..."
              />
            </div>

            {/* Video Upload */}
            <div>
              <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                Reference Video (Optional)
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload a reference video to help athletes understand the drill better.
              </p>
            </div>

            {/* Preview */}
            {(formData.name || formData.goal || formData.instructions) && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Drill Preview</h3>
                <div className="space-y-3">
                  {formData.name && <p><strong>Name:</strong> {formData.name}</p>}
                  {formData.goal && <p><strong>Goal:</strong> {formData.goal}</p>}
                  {formData.instructions && (
                    <div>
                      <strong>Instructions:</strong>
                      <p className="mt-1 text-gray-700">{formData.instructions}</p>
                    </div>
                  )}
                  {formData.videoFile && <p><strong>Video:</strong> {formData.videoFile.name}</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={uploading}
                className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-10 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Creating Drill...' : 'Create Drill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
