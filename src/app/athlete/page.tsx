"use client";
import React from 'react';
import { useRouter } from "next/navigation";

export default function AthleteDashboard() {
    const router = useRouter();
    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-6xl'>Athlete Dashboard</p>
                <button onClick={() => router.push('/')} className="absolute right-3 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Home</button>
            </div>
            
            {/* Main Content Area */}
            <div className="bg-white h-2/3 px-8 flex items-center justify-center">
                <div className="flex gap-8 w-full max-w-6xl">
                    {/* Card 1 - Assigned Drills */}
                    <div className="relative bg-white border-4 border-gray-200 rounded-2xl h-[40vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex-1 flex flex-col items-center text-center transform hover:scale-105">
                        <p className="text-gray-800 font-sans font-bold mb-6 text-2xl">
                            View all drills assigned by your coach
                        </p>
                        <button onClick={() => router.push('/athlete/drills')} className="absolute bg-gradient-to-r from-purple-900 to-blue-900 top-[30vh] text-white px-8 py-3 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                            Assigned Drills
                        </button>
                    </div>
                    
                    {/* Card 2 - Do Drill */}
                    <div className="relative bg-white border-4 border-gray-200 rounded-2xl h-[40vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex-1 flex flex-col items-center text-center transform hover:scale-105">
                        <p className="text-gray-800 font-sans font-bold mb-6 text-2xl">
                            Record and submit your drill performance
                        </p>
                        <button onClick={() => router.push('/athlete/submit')} className="absolute font-roboto font-medium bg-gradient-to-r from-purple-900 to-blue-900 text-white top-[30vh] px-8 py-3 rounded-lg hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                            Complete Drill
                        </button>
                    </div>
                    
                    {/* Card 3 - Reports */}
                    <div className="bg-white border-4 relative border-gray-200 rounded-2xl h-[40vh] shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex-1 flex flex-col items-center text-center transform hover:scale-105">
                        <p className="text-gray-800 font-sans font-bold mb-6 text-2xl">
                            View your progress reports and feedback
                        </p>
                        <button onClick={() => router.push('/athlete/report')} className="absolute bg-gradient-to-r from-purple-900 to-blue-900 text-white top-[30vh] px-8 py-3 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                            Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
