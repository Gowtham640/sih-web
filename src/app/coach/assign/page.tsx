'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function AssignPage() {
    const router = useRouter();
    const [selectedAthlete, setSelectedAthlete] = useState<string>('');
    const [selectedDrill, setSelectedDrill] = useState<string>('');
    const [drillGoal, setDrillGoal] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [showToast, setShowToast] = useState(false);

    // Mock data with Indian names
    const athletes = [
        { id: '1', name: 'Arjun Sharma', grade: '10th', sport: 'Cricket', completedDrills: 8, pendingDrills: 2, submittedDrills: 1 },
        { id: '2', name: 'Priya Patel', grade: '11th', sport: 'Badminton', completedDrills: 12, pendingDrills: 1, submittedDrills: 3 },
        { id: '3', name: 'Rahul Kumar', grade: '9th', sport: 'Football', completedDrills: 6, pendingDrills: 4, submittedDrills: 2 },
        { id: '4', name: 'Sneha Singh', grade: '12th', sport: 'Swimming', completedDrills: 15, pendingDrills: 0, submittedDrills: 5 },
        { id: '5', name: 'Vikram Reddy', grade: '10th', sport: 'Athletics', completedDrills: 10, pendingDrills: 3, submittedDrills: 2 },
        { id: '6', name: 'Ananya Gupta', grade: '11th', sport: 'Tennis', completedDrills: 9, pendingDrills: 2, submittedDrills: 1 },
        { id: '7', name: 'Karthik Nair', grade: '9th', sport: 'Basketball', completedDrills: 7, pendingDrills: 5, submittedDrills: 3 },
        { id: '8', name: 'Meera Joshi', grade: '12th', sport: 'Volleyball', completedDrills: 11, pendingDrills: 1, submittedDrills: 4 },
    ];

    // Available drills created by coach
    const availableDrills = [
        { id: '1', name: 'Cricket Batting Practice', category: 'Cricket', goal: 'Improve batting technique' },
        { id: '2', name: 'Badminton Footwork', category: 'Badminton', goal: 'Enhance court movement' },
        { id: '3', name: 'Football Dribbling', category: 'Football', goal: 'Master ball control' },
        { id: '4', name: 'Swimming Freestyle', category: 'Swimming', goal: 'Perfect stroke technique' },
        { id: '5', name: '100m Sprint Training', category: 'Athletics', goal: 'Improve speed and endurance' },
        { id: '6', name: 'Tennis Serve Practice', category: 'Tennis', goal: 'Consistent serve accuracy' },
        { id: '7', name: 'Basketball Shooting', category: 'Basketball', goal: 'Increase shooting percentage' },
        { id: '8', name: 'Volleyball Spiking', category: 'Volleyball', goal: 'Powerful attack technique' },
    ];

    const handleAssignDrill = () => {
        if (selectedAthlete && selectedDrill && drillGoal && dueDate) {
            // Handle drill assignment logic here
            console.log('Assigning drill:', {
                athlete: selectedAthlete,
                drill: selectedDrill,
                goal: drillGoal,
                dueDate: dueDate
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            // Reset form
            setSelectedAthlete('');
            setSelectedDrill('');
            setDrillGoal('');
            setDueDate('');
        } else {
            alert('Please fill in all required fields');
        }
    };

    const selectedAthleteData = athletes.find(athlete => athlete.id === selectedAthlete);
    const selectedDrillData = availableDrills.find(drill => drill.id === selectedDrill);

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>Assign Tests & Drills</p>
                <button
                    onClick={() => router.push('/coach')}
                    className="absolute right-3 bg-white text-blue-900 p-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
            </div>
            
            {/* Main Content Area */}
            <div className="bg-white px-8 py-8 h-auto">
                <div className="w-full max-w-none">
                    {/* Athletes List */}
                    <div className="mb-8">
                        <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                            Athletes Under Your Coaching
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {athletes.map(athlete => (
                                <div 
                                    key={athlete.id} 
                                    className={`bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${
                                        selectedAthlete === athlete.id ? 'border-purple-500 bg-purple-50' : ''
                                    }`}
                                    onClick={() => setSelectedAthlete(athlete.id)}
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {athlete.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{athlete.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{athlete.grade} • {athlete.sport}</p>
                                        
                                        {/* Quick Stats */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Completed:</span>
                                                <span className="text-sm font-bold text-green-600">{athlete.completedDrills}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Pending:</span>
                                                <span className="text-sm font-bold text-yellow-600">{athlete.pendingDrills}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Submitted:</span>
                                                <span className="text-sm font-bold text-blue-600">{athlete.submittedDrills}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assignment Form */}
                    {selectedAthleteData && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-6">
                            <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                                Assign Drill to {selectedAthleteData.name}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Drill Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Drill *
                                    </label>
                                    <select
                                        value={selectedDrill}
                                        onChange={(e) => setSelectedDrill(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">Choose a drill...</option>
                                        {availableDrills.map(drill => (
                                            <option key={drill.id} value={drill.id}>
                                                {drill.name} ({drill.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Custom Goal */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Set Specific Goal *
                                </label>
                                <input
                                    type="text"
                                    value={drillGoal}
                                    onChange={(e) => setDrillGoal(e.target.value)}
                                    placeholder="e.g., Complete 100m under 10 seconds"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Assignment Summary */}
                            {selectedDrillData && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-medium text-gray-900 mb-2">Assignment Summary</h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>Athlete:</strong> {selectedAthleteData.name}</p>
                                        <p><strong>Drill:</strong> {selectedDrillData.name}</p>
                                        <p><strong>Category:</strong> {selectedDrillData.category}</p>
                                        <p><strong>Goal:</strong> {drillGoal}</p>
                                        {dueDate && <p><strong>Due Date:</strong> {dueDate}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Assign Button */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleAssignDrill}
                                    className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-10 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Assign Drill
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Toast Notification */}
                    {showToast && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Drill assigned successfully!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
