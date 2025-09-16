'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { supabase, Athlete } from '@/lib/supabase';

interface DrillAssignmentWithDrill {
    id: number;
    drill_id: number;
    athlete_id: number;
    assigned_by: number;
    assigned_at: string;
    due_date?: string;
    status: 'pending' | 'completed' | 'reviewed';
    drills: {
        id: number;
        name: string;
        goal?: string;
        instructions?: string;
        video_url?: string;
        created_at: string;
    };
    coaches: {
        name: string;
    };
}

export default function DrillsPage() {
    const router = useRouter();
    const [athlete, setAthlete] = useState<Athlete | null>(null);
    const [drillAssignments, setDrillAssignments] = useState<DrillAssignmentWithDrill[]>([]);
    const [selectedDrill, setSelectedDrill] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'reviewed'>('pending');
    const [showQueryModal, setShowQueryModal] = useState(false);
    const [queryText, setQueryText] = useState('');
    const [showQueryToast, setShowQueryToast] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeData = async () => {
            const storedAthlete = localStorage.getItem('athlete_user');
            if (!storedAthlete) {
                router.push('/');
                return;
            }

            const athleteData = JSON.parse(storedAthlete);
            setAthlete(athleteData);

            await loadDrillAssignments(athleteData.id);
            setIsLoading(false);
        };

        initializeData();
    }, [router]);

    const loadDrillAssignments = async (athleteId: number) => {
        const { data, error } = await supabase
            .from('drill_assignments')
            .select(`
                *,
                drills (
                    id,
                    name,
                    goal,
                    instructions,
                    video_url,
                    created_at
                ),
                coaches (
                    name
                )
            `)
            .eq('athlete_id', athleteId)
            .order('assigned_at', { ascending: false });

        if (data && !error) {
            setDrillAssignments(data as DrillAssignmentWithDrill[]);
        } else {
            console.error('Error loading drill assignments:', error);
        }
    };

    const filteredDrills = drillAssignments.filter(assignment => assignment.status === activeTab);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'reviewed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const selectedDrillData = drillAssignments.find(assignment => assignment.id === selectedDrill);

    const handleSubmitQuery = () => {
        if (queryText.trim()) {
            console.log('Query submitted:', queryText);
            setShowQueryToast(true);
            setTimeout(() => setShowQueryToast(false), 3000);
            setQueryText('');
            setShowQueryModal(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="bg-white w-full h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-600">Loading your drills...</div>
            </div>
        );
    }

    return (
        <div className='bg-white w-full min-h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>My Drills</p>
                <button
                    onClick={() => router.push('/athlete')}
                    className="absolute right-3 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-white px-8 py-8">
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
                                Pending Drills ({drillAssignments.filter(d => d.status === 'pending').length})
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    activeTab === 'completed'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Completed Drills ({drillAssignments.filter(d => d.status === 'completed').length})
                            </button>
                            <button
                                onClick={() => setActiveTab('reviewed')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    activeTab === 'reviewed'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Reviewed Drills ({drillAssignments.filter(d => d.status === 'reviewed').length})
                            </button>
                        </div>
                    </div>

                    {/* No drills message */}
                    {drillAssignments.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-xl mb-4">No drills assigned yet</div>
                            <p className="text-gray-400">Your coach will assign drills that will appear here.</p>
                        </div>
                    )}

                    {/* Drills List */}
                    {filteredDrills.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredDrills.map(assignment => (
                                <div
                                    key={assignment.id}
                                    className={`bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${
                                        selectedDrill === assignment.id ? 'border-purple-500 bg-purple-50' : ''
                                    }`}
                                    onClick={() => setSelectedDrill(assignment.id)}
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {assignment.drills.name.charAt(0)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{assignment.drills.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">Assigned by: {assignment.coaches.name}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Due Date:</span>
                                                <span className="text-sm font-medium text-gray-900">{formatDate(assignment.due_date)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Status:</span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Assigned:</span>
                                                <span className="text-sm font-medium text-gray-900">{formatDate(assignment.assigned_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state for filtered results */}
                    {filteredDrills.length === 0 && drillAssignments.length > 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-xl mb-4">No {activeTab} drills</div>
                            <p className="text-gray-400">You don't have any {activeTab} drills at the moment.</p>
                        </div>
                    )}

                    {/* Drill Details */}
                    {selectedDrillData && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
                            <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                                {selectedDrillData.drills.name} - Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column - Details */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Goal</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                            {selectedDrillData.drills.goal || 'No specific goal provided'}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Instructions</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                            {selectedDrillData.drills.instructions || 'No instructions provided'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                                            <div className="text-lg font-bold text-blue-600 mb-1">Due Date</div>
                                            <div className="text-gray-600">{formatDate(selectedDrillData.due_date)}</div>
                                        </div>
                                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
                                            <div className="text-lg font-bold text-purple-600 mb-1">Coach</div>
                                            <div className="text-gray-600">{selectedDrillData.coaches.name}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Reference Media */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">Reference Media</h3>
                                    {selectedDrillData.drills.video_url ? (
                                        <div className="bg-gray-100 rounded-lg overflow-hidden">
                                            {selectedDrillData.drills.video_url.includes('mp4') ||
                                             selectedDrillData.drills.video_url.includes('mov') ||
                                             selectedDrillData.drills.video_url.includes('avi') ? (
                                                <video
                                                    controls
                                                    className="w-full h-64 object-cover"
                                                    poster="/placeholder-video.jpg"
                                                >
                                                    <source src={selectedDrillData.drills.video_url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={selectedDrillData.drills.video_url}
                                                    alt="Drill reference"
                                                    className="w-full h-64 object-cover"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-900 rounded-lg p-8 text-center">
                                            <div className="text-white mb-4">
                                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-300 mb-4">No reference media provided</p>
                                            <p className="text-gray-400 text-sm">Follow the written instructions above</p>
                                        </div>
                                    )}
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
                                    Ask Question
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Query Modal */}
                    {showQueryModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">Ask a Question</h3>
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
                                        Submit Question
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
                                <span>Question submitted successfully!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
