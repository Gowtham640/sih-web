'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ReviewPage() {
    const router = useRouter();
    const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedDrillVideo, setSelectedDrillVideo] = useState<string>('');
    const [showGoalUpdateModal, setShowGoalUpdateModal] = useState(false);
    const [selectedDrill, setSelectedDrill] = useState<DrillWithProgress | null>(null);
    const [newGoal, setNewGoal] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showProgressGraph, setShowProgressGraph] = useState(false);
    // Define types for drill data
    interface ProgressHistoryEntry {
        date: string;
        goal: string;
        achieved: string;
    }

    interface DrillWithProgress {
        id: string;
        name: string;
        status: string;
        score: number | null;
        date: string;
        videoUrl: string;
        goal: string;
        currentGoal: string;
        progressHistory?: ProgressHistoryEntry[];
    }

    const [selectedDrillProgress, setSelectedDrillProgress] = useState<{
        id: string;
        drillName: string;
        category: string;
        goal: string;
        progressHistory: ProgressHistoryEntry[];
    } | null>(null);

    // Mock data with Indian names
    const athletes: Array<{
        id: string;
        name: string;
        sport: string;
        completedDrills: number;
        pendingDrills: number;
        submittedDrills: number;
        drills: DrillWithProgress[];
    }> = [
        { 
            id: '1', 
            name: 'Arjun Sharma', 
            sport: 'Cricket', 
            completedDrills: 8, 
            pendingDrills: 2, 
            submittedDrills: 1,
            drills: [
                { 
                    id: '1', 
                    name: 'Batting Practice', 
                    status: 'completed', 
                    score: 85, 
                    date: '2024-01-15', 
                    videoUrl: '', 
                    goal: 'Complete 50 batting shots', 
                    currentGoal: 'Complete 65 batting shots',
                    progressHistory: [
                        { date: '2024-01-01', goal: '50 shots', achieved: '48 shots' },
                        { date: '2024-01-05', goal: '55 shots', achieved: '52 shots' },
                        { date: '2024-01-10', goal: '60 shots', achieved: '58 shots' },
                        { date: '2024-01-15', goal: '65 shots', achieved: '63 shots' }
                    ]
                },
                { 
                    id: '2', 
                    name: 'Bowling Technique', 
                    status: 'submitted', 
                    score: null, 
                    date: '2024-01-14', 
                    videoUrl: 'sample-video-1.mp4', 
                    goal: 'Bowling accuracy 80%', 
                    currentGoal: 'Bowling accuracy 80%',
                    progressHistory: [
                        { date: '2024-01-01', goal: '70% accuracy', achieved: '65% accuracy' },
                        { date: '2024-01-05', goal: '75% accuracy', achieved: '72% accuracy' },
                        { date: '2024-01-10', goal: '80% accuracy', achieved: '78% accuracy' },
                        { date: '2024-01-14', goal: '80% accuracy', achieved: '79% accuracy' }
                    ]
                },
                { id: '3', name: 'Fielding Drills', status: 'pending', score: null, date: '2024-01-13', videoUrl: '', goal: 'Catch 15 balls', currentGoal: 'Catch 15 balls' },
            ]
        },
        { 
            id: '2', 
            name: 'Priya Patel', 
            sport: 'Badminton', 
            completedDrills: 12, 
            pendingDrills: 1, 
            submittedDrills: 3,
            drills: [
                { 
                    id: '4', 
                    name: 'Footwork Training', 
                    status: 'completed', 
                    score: 92, 
                    date: '2024-01-14', 
                    videoUrl: '', 
                    goal: 'Complete 20 rallies', 
                    currentGoal: 'Complete 25 rallies',
                    progressHistory: [
                        { date: '2024-01-01', goal: '20 rallies', achieved: '18 rallies' },
                        { date: '2024-01-05', goal: '22 rallies', achieved: '20 rallies' },
                        { date: '2024-01-10', goal: '24 rallies', achieved: '22 rallies' },
                        { date: '2024-01-14', goal: '25 rallies', achieved: '24 rallies' }
                    ]
                },
                { 
                    id: '5', 
                    name: 'Smash Practice', 
                    status: 'submitted', 
                    score: null, 
                    date: '2024-01-13', 
                    videoUrl: 'sample-video-2.mp4', 
                    goal: 'Smash accuracy 75%', 
                    currentGoal: 'Smash accuracy 75%',
                    progressHistory: [
                        { date: '2024-01-01', goal: '65% accuracy', achieved: '60% accuracy' },
                        { date: '2024-01-05', goal: '70% accuracy', achieved: '68% accuracy' },
                        { date: '2024-01-10', goal: '75% accuracy', achieved: '73% accuracy' },
                        { date: '2024-01-13', goal: '75% accuracy', achieved: '74% accuracy' }
                    ]
                },
                { id: '6', name: 'Serve Technique', status: 'submitted', score: null, date: '2024-01-12', videoUrl: 'sample-video-3.mp4', goal: 'Serve 10 aces', currentGoal: 'Serve 10 aces' },
            ]
        },
        { 
            id: '3', 
            name: 'Rahul Kumar', 
            sport: 'Football', 
            completedDrills: 6, 
            pendingDrills: 4, 
            submittedDrills: 2,
            drills: [
                { id: '7', name: 'Dribbling Skills', status: 'completed', score: 78, date: '2024-01-13', videoUrl: '', goal: 'Dribble 50m in 8 seconds', currentGoal: 'Dribble 50m in 7 seconds' },
                { id: '8', name: 'Passing Accuracy', status: 'submitted', score: null, date: '2024-01-12', videoUrl: 'sample-video-4.mp4', goal: 'Pass accuracy 85%', currentGoal: 'Pass accuracy 85%' },
                { id: '9', name: 'Shooting Practice', status: 'submitted', score: null, date: '2024-01-11', videoUrl: 'sample-video-5.mp4', goal: 'Score 8/10 shots', currentGoal: 'Score 8/10 shots' },
            ]
        },
        { 
            id: '4', 
            name: 'Sneha Singh', 
            sport: 'Swimming', 
            completedDrills: 15, 
            pendingDrills: 0, 
            submittedDrills: 5,
            drills: [
                { id: '10', name: 'Freestyle Stroke', status: 'completed', score: 88, date: '2024-01-12', videoUrl: '', goal: 'Swim 100m in 1:20', currentGoal: 'Swim 100m in 1:15' },
                { id: '11', name: 'Butterfly Technique', status: 'submitted', score: null, date: '2024-01-11', videoUrl: 'sample-video-6.mp4', goal: 'Butterfly 50m in 35s', currentGoal: 'Butterfly 50m in 35s' },
                { id: '12', name: 'Breaststroke Form', status: 'submitted', score: null, date: '2024-01-10', videoUrl: 'sample-video-7.mp4', goal: 'Breaststroke 50m in 40s', currentGoal: 'Breaststroke 50m in 40s' },
            ]
        },
        { 
            id: '5', 
            name: 'Vikram Reddy', 
            sport: 'Athletics', 
            completedDrills: 10, 
            pendingDrills: 3, 
            submittedDrills: 2,
            drills: [
                { id: '13', name: '100m Sprint', status: 'completed', score: 95, date: '2024-01-11', videoUrl: '', goal: '100m in 11 seconds', currentGoal: '100m in 10.5 seconds' },
                { id: '14', name: 'Long Jump', status: 'submitted', score: null, date: '2024-01-10', videoUrl: 'sample-video-8.mp4', goal: 'Jump 6.5m', currentGoal: 'Jump 6.5m' },
                { id: '15', name: 'High Jump', status: 'submitted', score: null, date: '2024-01-09', videoUrl: 'sample-video-9.mp4', goal: 'Jump 1.8m', currentGoal: 'Jump 1.8m' },
            ]
        },
    ];

    const filteredAthletes = filterStatus === 'all' 
        ? athletes 
        : athletes.filter(athlete => {
            switch (filterStatus) {
                case 'pending': return athlete.pendingDrills > 0;
                case 'submitted': return athlete.submittedDrills > 0;
                case 'completed': return athlete.completedDrills > 0;
                default: return true;
            }
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'submitted': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handleViewVideo = (videoUrl: string) => {
        setSelectedDrillVideo(videoUrl);
        setShowVideoModal(true);
    };

    const handleUpdateGoal = (drill: DrillWithProgress) => {
        setSelectedDrill(drill);
        setNewGoal(drill.currentGoal);
        setShowGoalUpdateModal(true);
    };

    const handleSaveGoal = () => {
        if (selectedDrill && newGoal && selectedAthlete) {
            // In a real app, this would update the database
            console.log(`Updated goal for ${selectedAthlete}'s ${selectedDrill.name} to: ${newGoal}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setShowGoalUpdateModal(false);
            setSelectedDrill(null);
            setNewGoal('');
        }
    };

    const selectedAthleteData = athletes.find(athlete => athlete.id === selectedAthlete);

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-roboto font-bold text-5xl'>Review Test Results</p>
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
                    {/* Filter Section */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 mb-6">
                        <h2 className="text-gray-800 font-sans font-bold mb-4 text-xl">Filter Athletes</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'all'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                All Athletes
                            </button>
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'pending'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Pending Drills
                            </button>
                            <button
                                onClick={() => setFilterStatus('submitted')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'submitted'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Submitted Drills
                            </button>
                            <button
                                onClick={() => setFilterStatus('completed')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'completed'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Completed Drills
                            </button>
                        </div>
                    </div>

                    {/* Athletes List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {filteredAthletes.map(athlete => (
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
                                    <p className="text-gray-600 text-sm mb-4">{athlete.sport}</p>
                                    
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

                    {/* Individual Athlete Details */}
                    {selectedAthleteData && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
                            <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                                {selectedAthleteData.name} - Drill Progress
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{selectedAthleteData.completedDrills}</div>
                                    <div className="text-gray-600 font-medium">Completed Drills</div>
                                </div>
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-yellow-600 mb-2">{selectedAthleteData.pendingDrills}</div>
                                    <div className="text-gray-600 font-medium">Pending Drills</div>
                                </div>
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{selectedAthleteData.submittedDrills}</div>
                                    <div className="text-gray-600 font-medium">Submitted Drills</div>
                                </div>
                            </div>

                            {/* Drills List */}
                            <div className="space-y-4">
                                <h3 className="text-gray-800 font-sans font-bold text-xl mb-4">Drill Details</h3>
                                {selectedAthleteData.drills.map(drill => (
                                    <div key={drill.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1">{drill.name}</h4>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                                    <span>Date: {drill.date}</span>
                                                    {drill.score && (
                                                        <span className={`font-medium ${getScoreColor(drill.score)}`}>
                                                            Score: {drill.score}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Original Goal: </span>
                                                    <span className="font-medium text-gray-700">{drill.goal}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Current Goal: </span>
                                                    <span className="font-medium text-blue-600">{drill.currentGoal}</span>
                                                </div>
                                                {drill.progressHistory && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDrillProgress({
                                                                id: drill.id,
                                                                drillName: drill.name,
                                                                category: selectedAthleteData.sport,
                                                                goal: drill.goal,
                                                                progressHistory: drill.progressHistory || []
                                                            });
                                                            setShowProgressGraph(true);
                                                        }}
                                                        className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-blue-500 hover:scale-105 transform transition-all duration-300"
                                                    >
                                                        View Progress Graph
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(drill.status)}`}>
                                                    {drill.status.charAt(0).toUpperCase() + drill.status.slice(1)}
                                                </span>
                                                {drill.status === 'completed' && (
                                                    <button
                                                        onClick={() => handleUpdateGoal(drill)}
                                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-500 hover:to-green-600 hover:scale-105 transform transition-all duration-300"
                                                    >
                                                        Update Goal
                                                    </button>
                                                )}
                                                {drill.status === 'submitted' && drill.videoUrl && (
                                                    <button
                                                        onClick={() => handleViewVideo(drill.videoUrl)}
                                                        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300"
                                                    >
                                                        View Video
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Modal */}
                    {showVideoModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">Drill Video</h3>
                                    <button
                                        onClick={() => setShowVideoModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="bg-gray-900 rounded-lg p-8 text-center">
                                    <div className="text-white mb-4">
                                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-300 mb-4">Video: {selectedDrillVideo}</p>
                                    <p className="text-gray-400 text-sm">Video player would be embedded here</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Goal Update Modal */}
                    {showGoalUpdateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Update Drill Goal</h3>
                                    <button
                                        onClick={() => setShowGoalUpdateModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="mb-6">
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Drill:</span> {selectedDrill?.name}
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-medium">Current Goal:</span> {selectedDrill?.currentGoal}
                                    </p>
                                    
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Goal
                                    </label>
                                    <input
                                        type="text"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter new goal (e.g., 100m in 9 seconds)"
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowGoalUpdateModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveGoal}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-600 hover:scale-105 transform transition-all duration-300"
                                    >
                                        Update Goal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toast Notification */}
                    {showToast && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Goal updated successfully!
                            </div>
                        </div>
                    )}

                    {/* Progress Graph Modal */}
                    {showProgressGraph && selectedDrillProgress && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800">Progress Tracking - {selectedDrillProgress.drillName}</h3>
                                    <button
                                        onClick={() => setShowProgressGraph(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="mb-6">
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-medium">Current Goal:</span> {selectedDrillProgress.goal}
                                    </p>
                                    
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-gray-800 mb-4">Progress Over Time</h4>
                                        
                                        <div className="mb-8">
                                            <h5 className="text-md font-bold text-gray-800 mb-4">Performance Timeline</h5>
                                            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                                                <div className="h-80 relative">
                                                    <svg className="w-full h-full" viewBox="0 0 800 300">
                                                        {/* Y-axis (Time) */}
                                                        <line x1="60" y1="20" x2="60" y2="280" stroke="#e5e7eb" strokeWidth="2"/>
                                                        {/* X-axis (Performance) */}
                                                        <line x1="60" y1="280" x2="740" y2="280" stroke="#e5e7eb" strokeWidth="2"/>
                                                        
                                                        {/* Extract numeric values and create chart */}
                                                        {selectedDrillProgress.progressHistory.map((entry: {
                                                            date: string;
                                                            goal: string;
                                                            achieved: string;
                                                        }, index: number) => {
                                                            // Extract numeric values - handle different formats
                                                            const goalValue = parseFloat(entry.goal.match(/(\d+\.?\d*)/)?.[1] || '0');
                                                            const achievedValue = parseFloat(entry.achieved.match(/(\d+\.?\d*)/)?.[1] || '0');
                                                            
                                                            // Find min and max values for scaling
                                                            const allValues = selectedDrillProgress.progressHistory.map((e: {
                                                                date: string;
                                                                goal: string;
                                                                achieved: string;
                                                            }) => [
                                                                parseFloat(e.goal.match(/(\d+\.?\d*)/)?.[1] || '0'),
                                                                parseFloat(e.achieved.match(/(\d+\.?\d*)/)?.[1] || '0')
                                                            ]).flat();
                                                            const minValue = Math.min(...allValues);
                                                            const maxValue = Math.max(...allValues);
                                                            const valueRange = maxValue - minValue || 1; // Avoid division by zero
                                                            
                                                            // Calculate positions - X for performance, Y for time
                                                            const goalX = 60 + ((goalValue - minValue) / valueRange) * 680;
                                                            const achievedX = 60 + ((achievedValue - minValue) / valueRange) * 680;
                                                            const y = 280 - (index / (selectedDrillProgress.progressHistory.length - 1)) * 240;
                                                            
                                                            return (
                                                                <g key={index}>
                                                                    {/* Goal point */}
                                                                    <circle
                                                                        cx={goalX}
                                                                        cy={y}
                                                                        r="6"
                                                                        fill="#ef4444"
                                                                        className="transition-all duration-500"
                                                                    />
                                                                    {/* Achieved point */}
                                                                    <circle
                                                                        cx={achievedX}
                                                                        cy={y}
                                                                        r="6"
                                                                        fill="#10b981"
                                                                        className="transition-all duration-500"
                                                                    />
                                                                    
                                                                    {/* Connect to next point */}
                                                                    {index < selectedDrillProgress.progressHistory.length - 1 && (
                                                                        <>
                                                                            {/* Goal line */}
                                                                            <line
                                                                                x1={goalX}
                                                                                y1={y}
                                                                                x2={60 + ((parseFloat(selectedDrillProgress.progressHistory[index + 1].goal.match(/(\d+\.?\d*)/)?.[1] || '0') - minValue) / valueRange) * 680}
                                                                                y2={280 - ((index + 1) / (selectedDrillProgress.progressHistory.length - 1)) * 240}
                                                                                stroke="#ef4444"
                                                                                strokeWidth="3"
                                                                                strokeDasharray="8,4"
                                                                                className="transition-all duration-500"
                                                                            />
                                                                            {/* Achieved line */}
                                                                            <line
                                                                                x1={achievedX}
                                                                                y1={y}
                                                                                x2={60 + ((parseFloat(selectedDrillProgress.progressHistory[index + 1].achieved.match(/(\d+\.?\d*)/)?.[1] || '0') - minValue) / valueRange) * 680}
                                                                                y2={280 - ((index + 1) / (selectedDrillProgress.progressHistory.length - 1)) * 240}
                                                                                stroke="#10b981"
                                                                                strokeWidth="3"
                                                                                className="transition-all duration-500"
                                                                            />
                                                                        </>
                                                                    )}
                                                                    
                                                                    {/* Time labels on Y-axis */}
                                                                    <text x="50" y={y + 5} fontSize="12" fill="#6b7280" textAnchor="end">
                                                                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                    </text>
                                                                    
                                                                    {/* Performance labels on X-axis */}
                                                                    <text x={goalX} y="295" fontSize="10" fill="#ef4444" textAnchor="middle">
                                                                        {entry.goal.match(/(\d+\.?\d*)/)?.[1] || '0'}{entry.goal.includes('minutes') ? 'min' : entry.goal.includes('shots') ? 'shots' : entry.goal.includes('rallies') ? 'rallies' : entry.goal.includes('accuracy') ? '%' : 's'}
                                                                    </text>
                                                                    <text x={achievedX} y="310" fontSize="10" fill="#10b981" textAnchor="middle">
                                                                        {entry.achieved.match(/(\d+\.?\d*)/)?.[1] || '0'}{entry.achieved.includes('minutes') ? 'min' : entry.achieved.includes('shots') ? 'shots' : entry.achieved.includes('rallies') ? 'rallies' : entry.achieved.includes('accuracy') ? '%' : 's'}
                                                                    </text>
                                                                </g>
                                                            );
                                                        })}
                                                        
                                                        {/* X-axis labels (Performance) */}
                                                        {(() => {
                                                            const allValues = selectedDrillProgress.progressHistory.map((e: {
                                                                date: string;
                                                                goal: string;
                                                                achieved: string;
                                                            }) => [
                                                                parseFloat(e.goal.match(/(\d+\.?\d*)/)?.[1] || '0'),
                                                                parseFloat(e.achieved.match(/(\d+\.?\d*)/)?.[1] || '0')
                                                            ]).flat();
                                                            const minValue = Math.min(...allValues);
                                                            const maxValue = Math.max(...allValues);
                                                            const midValue = (minValue + maxValue) / 2;
                                                            
                                                            // Determine unit from the first entry
                                                            const firstEntry = selectedDrillProgress.progressHistory[0];
                                                            const unit = firstEntry.goal.includes('minutes') ? 'min' : 
                                                                        firstEntry.goal.includes('seconds') ? 's' : 
                                                                        firstEntry.goal.includes('shots') ? 'shots' : 
                                                                        firstEntry.goal.includes('rallies') ? 'rallies' :
                                                                        firstEntry.goal.includes('accuracy') ? '%' :
                                                                        firstEntry.goal.includes('dribbles') ? 'dribbles' :
                                                                        firstEntry.goal.includes('sprints') ? 'sprints' : 's';
                                                            
                                                            return (
                                                                <>
                                                                    <text x="60" y="320" fontSize="12" fill="#6b7280" textAnchor="start">
                                                                        {minValue}{unit}
                                                                    </text>
                                                                    <text x="400" y="320" fontSize="12" fill="#6b7280" textAnchor="middle">
                                                                        {midValue.toFixed(1)}{unit}
                                                                    </text>
                                                                    <text x="740" y="320" fontSize="12" fill="#6b7280" textAnchor="end">
                                                                        {maxValue}{unit}
                                                                    </text>
                                                                </>
                                                            );
                                                        })()}
                                                        
                                                        {/* Axis labels */}
                                                        <text x="400" y="340" fontSize="14" fill="#374151" textAnchor="middle" fontWeight="bold">
                                                            {(() => {
                                                                const firstEntry = selectedDrillProgress.progressHistory[0];
                                                                if (firstEntry.goal.includes('minutes')) return 'Performance (Minutes)';
                                                                if (firstEntry.goal.includes('shots')) return 'Performance (Shots)';
                                                                if (firstEntry.goal.includes('rallies')) return 'Performance (Rallies)';
                                                                if (firstEntry.goal.includes('accuracy')) return 'Performance (Accuracy %)';
                                                                if (firstEntry.goal.includes('dribbles')) return 'Performance (Dribbles)';
                                                                if (firstEntry.goal.includes('sprints')) return 'Performance (Sprints)';
                                                                return 'Performance (Seconds)';
                                                            })()}
                                                        </text>
                                                        <text x="20" y="150" fontSize="14" fill="#374151" textAnchor="middle" fontWeight="bold" transform="rotate(-90 20 150)">
                                                            Time (Days)
                                                        </text>
                                                    </svg>
                                                </div>
                                                
                                                {/* Legend */}
                                                <div className="flex justify-center space-x-8 mt-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                                        <span className="text-sm text-gray-700">Goal</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                        <span className="text-sm text-gray-700">Achieved</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Detailed Progress Timeline */}
                                            <div className="mt-6">
                                                <h5 className="text-md font-bold text-gray-800 mb-4">Detailed Progress</h5>
                                                <div className="space-y-3">
                                                    {selectedDrillProgress.progressHistory.map((entry: {
                                                        date: string;
                                                        goal: string;
                                                        achieved: string;
                                                    }, index: number) => (
                                                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-medium text-gray-800">{new Date(entry.date).toLocaleDateString('en-US', { 
                                                                        weekday: 'long', 
                                                                        year: 'numeric', 
                                                                        month: 'long', 
                                                                        day: 'numeric' 
                                                                    })}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Goal:</span> {entry.goal}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Achieved:</span> {entry.achieved}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowProgressGraph(false)}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 hover:scale-105 transform transition-all duration-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
