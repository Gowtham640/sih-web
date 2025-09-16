'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ReportPage() {
    const router = useRouter();
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showProgressGraph, setShowProgressGraph] = useState(false);
    const [selectedDrillProgress, setSelectedDrillProgress] = useState<{
        id: string;
        drillName: string;
        category: string;
        goal: string;
        progressHistory: Array<{
            date: string;
            goal: string;
            achieved: string;
        }>;
    } | null>(null);

    // Mock data with Indian names and realistic scenarios
    const reports = [
        {
            id: '1',
            drillName: 'Cricket Batting Practice',
            category: 'Cricket',
            submittedDate: '2024-01-16',
            status: 'approved',
            score: 88,
            coachName: 'Coach Rajesh Kumar',
            feedback: 'Excellent batting technique! Your stance and timing are perfect. Keep practicing the follow-through to improve power.',
            remarks: null,
            approvedDate: '2024-01-17',
            goal: 'Complete 50 batting shots in 2 minutes',
            instructions: 'Focus on proper stance, watch the ball closely, and maintain balance throughout the shot. Practice for 30 minutes daily. Record yourself performing 20 batting shots with proper form.',
            submittedVideo: null,
            progressHistory: [
                { date: '2024-01-01', goal: '50 shots in 2.5 minutes', achieved: '48 shots in 2.5 minutes' },
                { date: '2024-01-05', goal: '55 shots in 2.5 minutes', achieved: '52 shots in 2.5 minutes' },
                { date: '2024-01-10', goal: '60 shots in 2.5 minutes', achieved: '58 shots in 2.5 minutes' },
                { date: '2024-01-15', goal: '65 shots in 2.5 minutes', achieved: '63 shots in 2.5 minutes' }
            ]
        },
        {
            id: '2',
            drillName: 'Badminton Footwork',
            category: 'Badminton',
            submittedDate: '2024-01-15',
            status: 'rejected',
            score: null,
            coachName: 'Coach Priya Sharma',
            feedback: null,
            remarks: 'Footwork needs improvement. You are not maintaining proper court positioning. Please focus on quick directional changes and practice the shadow footwork drill again.',
            rejectedDate: '2024-01-16',
            goal: 'Enhance court movement and agility',
            instructions: 'Practice quick movements between corners, maintain low center of gravity, and focus on explosive starts. Record 5 minutes of continuous footwork drills.',
            submittedVideo: 'badminton-footwork-submission.mp4'
        },
        {
            id: '3',
            drillName: 'Football Dribbling',
            category: 'Football',
            submittedDate: '2024-01-14',
            status: 'approved',
            score: 92,
            coachName: 'Coach Vikram Singh',
            feedback: 'Outstanding ball control! Your close touches and direction changes are very smooth. Great improvement from last time.',
            remarks: null,
            approvedDate: '2024-01-15',
            goal: 'Master ball control and close touches',
            instructions: 'Keep the ball close to your feet, use both feet equally, and practice changing direction quickly. Record yourself dribbling through cones for 3 minutes.',
            submittedVideo: null,
            progressHistory: [
                { date: '2024-01-01', goal: 'Complete 50 dribbles', achieved: 'Complete 45 dribbles' },
                { date: '2024-01-05', goal: 'Complete 60 dribbles', achieved: 'Complete 55 dribbles' },
                { date: '2024-01-10', goal: 'Complete 70 dribbles', achieved: 'Complete 68 dribbles' },
                { date: '2024-01-14', goal: 'Complete 80 dribbles', achieved: 'Complete 75 dribbles' }
            ]
        },
        {
            id: '4',
            drillName: 'Swimming Freestyle',
            category: 'Swimming',
            submittedDate: '2024-01-13',
            status: 'pending',
            score: null,
            coachName: 'Coach Ananya Patel',
            feedback: null,
            remarks: null,
            goal: 'Perfect stroke technique and breathing',
            instructions: 'Maintain proper body position, coordinate breathing with arm strokes, and focus on smooth movements. Record 2 laps of freestyle swimming.',
            submittedVideo: null
        },
        {
            id: '5',
            drillName: '100m Sprint Training',
            category: 'Athletics',
            submittedDate: '2024-01-12',
            status: 'rejected',
            score: null,
            coachName: 'Coach Rahul Verma',
            feedback: null,
            remarks: 'Your start technique needs work. Focus on explosive power from the blocks and maintain proper body angle. Also, your breathing pattern is inconsistent throughout the race.',
            rejectedDate: '2024-01-13',
            goal: 'Improve speed and endurance',
            instructions: 'Focus on explosive starts, maintain form throughout the race, and practice proper breathing technique. Record yourself running 3 sets of 100m sprints.',
            submittedVideo: 'sprint-training-submission.mp4',
            progressHistory: [
                { date: '2024-01-01', goal: 'Complete 50 sprints', achieved: 'Complete 45 sprints' },
                { date: '2024-01-05', goal: 'Complete 60 sprints', achieved: 'Complete 55 sprints' },
                { date: '2024-01-10', goal: 'Complete 70 sprints', achieved: 'Complete 68 sprints' },
                { date: '2024-01-12', goal: 'Complete 80 sprints', achieved: 'Complete 75 sprints' }
            ]
        },
        {
            id: '6',
            drillName: 'Tennis Serve Practice',
            category: 'Tennis',
            submittedDate: '2024-01-11',
            status: 'approved',
            score: 85,
            coachName: 'Coach Sneha Reddy',
            feedback: 'Good serve technique! Your toss is consistent and the follow-through is smooth. Work on increasing power while maintaining accuracy.',
            remarks: null,
            approvedDate: '2024-01-12',
            goal: 'Consistent serve accuracy',
            instructions: 'Focus on proper toss height, maintain consistent ball contact point, and follow through completely. Record 20 serves with proper form.',
            submittedVideo: null
        }
    ];

    const filteredReports = filterStatus === 'all' 
        ? reports 
        : reports.filter(report => report.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'rejected':
                return (
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'pending':
                return (
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const selectedReportData = reports.find(report => report.id === selectedReport);

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>My Reports</p>
                <button
                    onClick={() => router.push('/athlete')}
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
                        <h2 className="text-gray-800 font-sans font-bold mb-4 text-xl">Filter Reports</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'all'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                All Reports ({reports.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('approved')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'approved'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Approved ({reports.filter(r => r.status === 'approved').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('rejected')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'rejected'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Rejected ({reports.filter(r => r.status === 'rejected').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    filterStatus === 'pending'
                                        ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                                }`}
                            >
                                Pending ({reports.filter(r => r.status === 'pending').length})
                            </button>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {filteredReports.map(report => (
                            <div 
                                key={report.id} 
                                className={`bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${
                                    selectedReport === report.id ? 'border-purple-500 bg-purple-50' : ''
                                }`}
                                onClick={() => setSelectedReport(report.id)}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {report.category.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{report.drillName}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{report.category}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Coach:</span>
                                            <span className="text-sm font-medium text-gray-900">{report.coachName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Status:</span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </span>
                                        </div>
                                        {report.score && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Score:</span>
                                                <span className="text-sm font-bold text-green-600">{report.score}%</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Submitted:</span>
                                            <span className="text-sm font-medium text-gray-900">{report.submittedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Report Details */}
                    {selectedReportData && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-gray-800 font-sans font-bold text-2xl">
                                    {selectedReportData.drillName} - Report
                                </h2>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(selectedReportData.status)}
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedReportData.status)}`}>
                                        {selectedReportData.status.charAt(0).toUpperCase() + selectedReportData.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column - Drill Details */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                                        <h3 className="font-bold text-gray-900 mb-3">Drill Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Category:</span>
                                                <span className="font-medium text-gray-700">{selectedReportData.category}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Coach:</span>
                                                <span className="text-gray-700 font-medium">{selectedReportData.coachName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Submitted:</span>
                                                <span className="font-medium text-gray-700">{selectedReportData.submittedDate}</span>
                                            </div>
                                            {selectedReportData.status === 'approved' && selectedReportData.approvedDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Approved:</span>
                                                    <span className="font-medium text-gray-700">{selectedReportData.approvedDate}</span>
                                                </div>
                                            )}
                                            {selectedReportData.status === 'rejected' && selectedReportData.rejectedDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Rejected:</span>
                                                    <span className="font-medium text-gray-700">{selectedReportData.rejectedDate}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                        <h3 className="font-bold text-blue-900 mb-3">Drill Goal</h3>
                                        <p className="text-blue-800">{selectedReportData.goal}</p>
                                        {selectedReportData.progressHistory && (
                                            <button
                                                onClick={() => {
                                                    setSelectedDrillProgress(selectedReportData);
                                                    setShowProgressGraph(true);
                                                }}
                                                className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-600 hover:scale-105 transform transition-all duration-300"
                                            >
                                                View Progress Graph
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                                        <h3 className="font-bold text-purple-900 mb-3">Coach Instructions</h3>
                                        <p className="text-purple-800">{selectedReportData.instructions}</p>
                                    </div>

                                    {selectedReportData.score && (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">{selectedReportData.score}%</div>
                                            <div className="text-gray-600 font-medium">Final Score</div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Feedback/Remarks & Video */}
                                <div className="space-y-6">
                                    {selectedReportData.status === 'approved' && selectedReportData.feedback && (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                            <h3 className="font-bold text-green-900 mb-3 flex items-center">
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Coach Feedback
                                            </h3>
                                            <p className="text-green-800">{selectedReportData.feedback}</p>
                                        </div>
                                    )}

                                    {selectedReportData.status === 'rejected' && selectedReportData.remarks && (
                                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                            <h3 className="font-bold text-red-900 mb-3 flex items-center">
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                Coach Remarks
                                            </h3>
                                            <p className="text-red-800">{selectedReportData.remarks}</p>
                                        </div>
                                    )}

                                    {selectedReportData.status === 'pending' && (
                                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                                            <div className="text-yellow-600 mb-2">
                                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-yellow-900 mb-2">Under Review</h3>
                                            <p className="text-yellow-800">Your submission is being reviewed by your coach. You will receive feedback soon.</p>
                                        </div>
                                    )}

                                    {/* Submitted Video for Rejected Drills */}
                                    {selectedReportData.status === 'rejected' && selectedReportData.submittedVideo && (
                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Your Submitted Video
                                            </h3>
                                            <div className="bg-gray-900 rounded-lg p-6 text-center">
                                                <div className="text-white mb-4">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-300 mb-2">Video: {selectedReportData.submittedVideo}</p>
                                                <p className="text-gray-400 text-sm">Your submitted video would be displayed here</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-center space-x-4">
                                {selectedReportData.status === 'rejected' && (
                                    <button
                                        onClick={() => router.push('/athlete/submit')}
                                        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Retry Drill
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/athlete/drills')}
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    View All Drills
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {reports.filter(r => r.status === 'approved').length}
                            </div>
                            <div className="text-gray-600">Approved Drills</div>
                        </div>
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg p-6 text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                                {reports.filter(r => r.status === 'rejected').length}
                            </div>
                            <div className="text-gray-600">Rejected Drills</div>
                        </div>
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg p-6 text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-2">
                                {reports.filter(r => r.status === 'pending').length}
                            </div>
                            <div className="text-gray-600">Pending Review</div>
                        </div>
                    </div>

                    {/* Progress Graph Modal */}
                    {showProgressGraph && selectedDrillProgress && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        Progress Tracking - {selectedDrillProgress.drillName}
                                    </h3>
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
                                    
                                    {/* Progress Chart */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-gray-800 mb-4">Progress Over Time</h4>
                                        
                                        {/* Time vs Performance Chart */}
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
                                                                        {entry.goal.match(/(\d+\.?\d*)/)?.[1] || '0'}{entry.goal.includes('minutes') ? 'min' : entry.goal.includes('shots') ? 'shots' : entry.goal.includes('dribbles') ? 'dribbles' : entry.goal.includes('sprints') ? 'sprints' : 's'}
                                                                    </text>
                                                                    <text x={achievedX} y="310" fontSize="10" fill="#10b981" textAnchor="middle">
                                                                        {entry.achieved.match(/(\d+\.?\d*)/)?.[1] || '0'}{entry.achieved.includes('minutes') ? 'min' : entry.achieved.includes('shots') ? 'shots' : entry.achieved.includes('dribbles') ? 'dribbles' : entry.achieved.includes('sprints') ? 'sprints' : 's'}
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
                                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                                        <span className="text-sm text-gray-600 font-medium">Goal</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm text-gray-600 font-medium">Achieved</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detailed Timeline */}
                                        <div className="space-y-4">
                                            <h5 className="text-md font-bold text-gray-800 mb-4">Detailed Progress</h5>
                                            {selectedDrillProgress.progressHistory.map((entry: {
                                                date: string;
                                                goal: string;
                                                achieved: string;
                                            }, index: number) => (
                                                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-500">{entry.date}</div>
                                                                <div className="font-medium text-gray-800">Goal: {entry.goal}</div>
                                                                <div className="text-sm text-gray-600">Achieved: {entry.achieved}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {/* Progress indicator */}
                                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm text-green-600 font-medium">Completed</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Visual Progress Bar */}
                                        <div className="mt-6">
                                            <h5 className="text-md font-bold text-gray-800 mb-3">Overall Progress</h5>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${(selectedDrillProgress.progressHistory.length / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                                <span>Start</span>
                                                <span>{selectedDrillProgress.progressHistory.length}/5 milestones</span>
                                                <span>Target</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowProgressGraph(false)}
                                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 hover:scale-105 transform transition-all duration-300"
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
