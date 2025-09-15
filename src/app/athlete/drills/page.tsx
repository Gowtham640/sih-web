'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function DrillsPage() {
    const router = useRouter();
    const [selectedDrill, setSelectedDrill] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'completed'>('pending');
    const [showQueryModal, setShowQueryModal] = useState(false);
    const [queryText, setQueryText] = useState('');
    const [showQueryToast, setShowQueryToast] = useState(false);

    // Mock data with Indian names
    const drills = [
        {
            id: '1',
            name: 'Cricket Batting Practice',
            goal: 'Improve batting technique and timing',
            instructions: 'Focus on proper stance, watch the ball closely, and maintain balance throughout the shot. Practice for 30 minutes daily.',
            status: 'pending',
            dueDate: '2024-01-20',
            category: 'Cricket',
            referenceVideo: 'cricket-batting-demo.mp4',
            assignedDate: '2024-01-15'
        },
        {
            id: '2',
            name: 'Badminton Footwork',
            goal: 'Enhance court movement and agility',
            instructions: 'Practice quick movements between corners, maintain low center of gravity, and focus on explosive starts.',
            status: 'submitted',
            dueDate: '2024-01-18',
            category: 'Badminton',
            referenceVideo: 'badminton-footwork-demo.mp4',
            assignedDate: '2024-01-12',
            submittedDate: '2024-01-16'
        },
        {
            id: '3',
            name: 'Football Dribbling',
            goal: 'Master ball control and close touches',
            instructions: 'Keep the ball close to your feet, use both feet equally, and practice changing direction quickly.',
            status: 'completed',
            dueDate: '2024-01-15',
            category: 'Football',
            referenceVideo: 'football-dribbling-demo.mp4',
            assignedDate: '2024-01-10',
            completedDate: '2024-01-14',
            score: 85
        },
        {
            id: '4',
            name: 'Swimming Freestyle',
            goal: 'Perfect stroke technique and breathing',
            instructions: 'Maintain proper body position, coordinate breathing with arm strokes, and focus on smooth movements.',
            status: 'pending',
            dueDate: '2024-01-22',
            category: 'Swimming',
            referenceVideo: 'swimming-freestyle-demo.mp4',
            assignedDate: '2024-01-16'
        },
        {
            id: '5',
            name: '100m Sprint Training',
            goal: 'Improve speed and endurance',
            instructions: 'Focus on explosive starts, maintain form throughout the race, and practice proper breathing technique.',
            status: 'submitted',
            dueDate: '2024-01-19',
            category: 'Athletics',
            referenceVideo: 'sprint-training-demo.mp4',
            assignedDate: '2024-01-13',
            submittedDate: '2024-01-17'
        }
    ];

    const filteredDrills = drills.filter(drill => drill.status === activeTab);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'submitted': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const selectedDrillData = drills.find(drill => drill.id === selectedDrill);

    const handleSubmitQuery = () => {
        if (queryText.trim()) {
            console.log('Query submitted:', queryText);
            setShowQueryToast(true);
            setTimeout(() => setShowQueryToast(false), 3000);
            setQueryText('');
            setShowQueryModal(false);
        }
    };

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>My Drills</p>
                <button 
                    onClick={() => router.push('/athlete')} 
                    className="absolute right-3 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Back to Dashboard
                </button>
            </div>
            
            {/* Main Content Area */}
            <div className="bg-white px-8 py-8 h-auto">
                <div className="w-full max-w-none">
                    {/* Tabs */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 mb-6">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    activeTab === 'pending'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Pending Drills ({drills.filter(d => d.status === 'pending').length})
                            </button>
                            <button
                                onClick={() => setActiveTab('submitted')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    activeTab === 'submitted'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Submitted Drills ({drills.filter(d => d.status === 'submitted').length})
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    activeTab === 'completed'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Completed Drills ({drills.filter(d => d.status === 'completed').length})
                            </button>
                        </div>
                    </div>

                    {/* Drills List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {filteredDrills.map(drill => (
                            <div 
                                key={drill.id} 
                                className={`bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${
                                    selectedDrill === drill.id ? 'border-purple-500 bg-purple-50' : ''
                                }`}
                                onClick={() => setSelectedDrill(drill.id)}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {drill.category.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{drill.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{drill.category}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Due Date:</span>
                                            <span className="text-sm font-medium text-gray-900">{drill.dueDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Status:</span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(drill.status)}`}>
                                                {drill.status.charAt(0).toUpperCase() + drill.status.slice(1)}
                                            </span>
                                        </div>
                                        {drill.score && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Score:</span>
                                                <span className="text-sm font-bold text-green-600">{drill.score}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Drill Details */}
                    {selectedDrillData && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
                            <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                                {selectedDrillData.name} - Details
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column - Details */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Goal</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedDrillData.goal}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Instructions</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedDrillData.instructions}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                                            <div className="text-lg font-bold text-blue-600 mb-1">Due Date</div>
                                            <div className="text-gray-600">{selectedDrillData.dueDate}</div>
                                        </div>
                                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
                                            <div className="text-lg font-bold text-purple-600 mb-1">Category</div>
                                            <div className="text-gray-600">{selectedDrillData.category}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Reference Video */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">Reference Video</h3>
                                    <div className="bg-gray-900 rounded-lg p-8 text-center">
                                        <div className="text-white mb-4">
                                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-300 mb-4">Video: {selectedDrillData.referenceVideo}</p>
                                        <p className="text-gray-400 text-sm">Reference video player would be embedded here</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-center space-x-4">
                                {selectedDrillData.status === 'pending' && (
                                    <button
                                        onClick={() => router.push('/athlete/submit')}
                                        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Start Recording
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowQueryModal(true)}
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Ask Query
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Query Modal */}
                    {showQueryModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">Ask a Query</h3>
                                    <button
                                        onClick={() => setShowQueryModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Question or Doubt
                                    </label>
                                    <textarea
                                        value={queryText}
                                        onChange={(e) => setQueryText(e.target.value)}
                                        placeholder="Type your question or doubt about this drill..."
                                        rows={4}
                                        className="w-full border text-gray-900 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowQueryModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitQuery}
                                        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 transition-all duration-300"
                                    >
                                        Submit Query
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Query Toast */}
                    {showQueryToast && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Query submitted successfully!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
