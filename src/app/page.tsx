"use client";
import React from 'react';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="bg-white w-full h-screen">
      {/* Gradient Header */}
      <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-32 flex items-center justify-center shadow-xl">
        <p className='absolute text-white font-sans font-bold text-6xl'>Sports Training Hub</p>
        <div className="absolute right-6 flex gap-4">
          <button onClick={() => router.push('/coach')} className="font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg">Coach Login</button>
          <button onClick={() => router.push('/athlete')} className="font-roboto font-medium text-lg flex text-center bg-white text-purple-900 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg">Athlete Login</button>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-8 py-16 flex justify-center">
        <div className="max-w-6xl w-full text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to Sports Training Hub
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A comprehensive platform for coaches and athletes to collaborate, track progress, and achieve peak performance through structured training programs.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Create Drills</h3>
              <p className="text-gray-600">Coaches can create comprehensive training drills with video instructions and performance goals.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Record Performance</h3>
              <p className="text-gray-600">Athletes can record their drill performances and submit them for coach review and feedback.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Track Progress</h3>
              <p className="text-gray-600">Monitor improvement over time with detailed analytics and performance reports.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stat 1 */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-center">
                  <p className="text-purple-100 text-sm font-medium">Active Coaches</p>
                  <p className="text-4xl font-bold">150+</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-center">
                  <p className="text-blue-100 text-sm font-medium">Active Athletes</p>
                  <p className="text-4xl font-bold">2,500+</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-center">
                  <p className="text-green-100 text-sm font-medium">Drills Completed</p>
                  <p className="text-4xl font-bold">15,000+</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-center">
                  <p className="text-yellow-100 text-sm font-medium">Success Rate</p>
                  <p className="text-4xl font-bold">94%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">Choose your role and begin your training journey today.</p>
            <div className="flex justify-center gap-6">
              <button onClick={() => router.push('/coach')} className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
                I&apos;m a Coach
              </button>
              <button onClick={() => router.push('/athlete')} className="bg-gradient-to-r from-blue-900 to-purple-900 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-800 hover:to-purple-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
                I&apos;m an Athlete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
