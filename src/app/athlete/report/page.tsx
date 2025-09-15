'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ReportPage() {
    const router = useRouter();
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

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
            goal: 'Improve batting technique and timing',
            instructions: 'Focus on proper stance, watch the ball closely, and maintain balance throughout the shot. Practice for 30 minutes daily. Record yourself performing 20 batting shots with proper form.',
            submittedVideo: null
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
            submittedVideo: null
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
            submittedVideo: 'sprint-training-submission.mp4'
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
                    className="absolute right-3 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Back to Dashboard
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
                </div>
            </div>
        </div>
    );
}
