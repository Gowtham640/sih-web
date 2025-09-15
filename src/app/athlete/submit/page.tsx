'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function SubmitPage() {
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
    const [selectedDrill, setSelectedDrill] = useState<string>('');
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Mock drills data with coach instructions
    const availableDrills = [
        { 
            id: '1', 
            name: 'Cricket Batting Practice', 
            category: 'Cricket',
            goal: 'Improve batting technique and timing',
            instructions: 'Focus on proper stance, watch the ball closely, and maintain balance throughout the shot. Practice for 30 minutes daily. Record yourself performing 20 batting shots with proper form.',
            dueDate: '2024-01-20',
            coachName: 'Coach Rajesh Kumar'
        },
        { 
            id: '2', 
            name: 'Badminton Footwork', 
            category: 'Badminton',
            goal: 'Enhance court movement and agility',
            instructions: 'Practice quick movements between corners, maintain low center of gravity, and focus on explosive starts. Record 5 minutes of continuous footwork drills.',
            dueDate: '2024-01-18',
            coachName: 'Coach Priya Sharma'
        },
        { 
            id: '3', 
            name: 'Football Dribbling', 
            category: 'Football',
            goal: 'Master ball control and close touches',
            instructions: 'Keep the ball close to your feet, use both feet equally, and practice changing direction quickly. Record yourself dribbling through cones for 3 minutes.',
            dueDate: '2024-01-15',
            coachName: 'Coach Vikram Singh'
        },
        { 
            id: '4', 
            name: 'Swimming Freestyle', 
            category: 'Swimming',
            goal: 'Perfect stroke technique and breathing',
            instructions: 'Maintain proper body position, coordinate breathing with arm strokes, and focus on smooth movements. Record 2 laps of freestyle swimming.',
            dueDate: '2024-01-22',
            coachName: 'Coach Ananya Patel'
        },
        { 
            id: '5', 
            name: '100m Sprint Training', 
            category: 'Athletics',
            goal: 'Improve speed and endurance',
            instructions: 'Focus on explosive starts, maintain form throughout the race, and practice proper breathing technique. Record yourself running 3 sets of 100m sprints.',
            dueDate: '2024-01-19',
            coachName: 'Coach Rahul Verma'
        },
    ];

    useEffect(() => {
        // Request camera permission on component mount
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            setCameraPermission(true);
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Camera permission denied:', error);
            setCameraPermission(false);
        }
    };

    const startRecording = async () => {
        if (!streamRef.current) {
            await requestCameraPermission();
            return;
        }

        try {
            const mediaRecorder = new MediaRecorder(streamRef.current);
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                setRecordedVideo(videoUrl);
                setRecordedChunks(chunks);
            };

            mediaRecorder.start();
            setMediaRecorder(mediaRecorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleSubmit = () => {
        if (recordedVideo && selectedDrill) {
            // Handle video submission logic here
            console.log('Submitting video for drill:', selectedDrill);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            
            // Reset form
            setRecordedVideo(null);
            setSelectedDrill('');
            setRecordedChunks([]);
        } else {
            alert('Please select a drill and record a video');
        }
    };

    const handleRetake = () => {
        setRecordedVideo(null);
        setRecordedChunks([]);
        if (streamRef.current) {
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
            }
        }
    };

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>Record Drill</p>
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
                    {/* Drill Selection */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-6">
                        <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                            Select Drill to Record
                        </h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Choose Drill *
                            </label>
                            <select
                                value={selectedDrill}
                                onChange={(e) => setSelectedDrill(e.target.value)}
                                className="w-full border text-gray-700 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Select a drill...</option>
                                {availableDrills.map(drill => (
                                    <option key={drill.id} value={drill.id}>
                                        {drill.name} ({drill.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Coach Instructions */}
                        {selectedDrill && (() => {
                            const drill = availableDrills.find(d => d.id === selectedDrill);
                            return drill ? (
                                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Coach Instructions</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Goal:</h4>
                                            <p className="text-gray-700 bg-white p-3 rounded-lg">{drill.goal}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
                                            <p className="text-gray-700 bg-white p-3 rounded-lg">{drill.instructions}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
                                                <div className="text-sm font-bold text-blue-600 mb-1">Due Date</div>
                                                <div className="text-gray-700">{drill.dueDate}</div>
                                            </div>
                                            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 text-center">
                                                <div className="text-sm font-bold text-purple-600 mb-1">Coach</div>
                                                <div className="text-gray-700">{drill.coachName}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>

                    {/* Camera Section */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-6">
                        <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                            Record Your Performance
                        </h2>
                        
                        {cameraPermission === false ? (
                            <div className="text-center p-8">
                                <div className="text-red-500 mb-4">
                                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Camera Access Required</h3>
                                <p className="text-gray-600 mb-4">Please allow camera access to record your drill performance.</p>
                                <button
                                    onClick={requestCameraPermission}
                                    className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300"
                                >
                                    Enable Camera
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Video Preview */}
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full max-w-2xl mx-auto rounded-lg border-4 border-gray-200"
                                    />
                                    {isRecording && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">REC</span>
                                        </div>
                                    )}
                                </div>

                                {/* Recording Controls */}
                                <div className="flex justify-center space-x-4">
                                    {!isRecording ? (
                                        <button
                                            onClick={startRecording}
                                            disabled={!selectedDrill}
                                            className={`px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                                selectedDrill
                                                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-xl'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                                </svg>
                                                <span>Start Recording</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopRecording}
                                            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 6h12v12H6z"/>
                                                </svg>
                                                <span>Stop Recording</span>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recorded Video Preview */}
                    {recordedVideo && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-6">
                            <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                                Review Your Recording
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <video
                                        src={recordedVideo}
                                        controls
                                        className="w-full max-w-2xl rounded-lg border-4 border-gray-200"
                                    />
                                </div>
                                
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleRetake}
                                        className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Retake Video
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Submit Video
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg p-6">
                        <h3 className="text-gray-800 font-sans font-bold mb-4 text-xl">
                            Recording Instructions
                        </h3>
                        <ul className="text-gray-600 space-y-2">
                            <li>• Ensure good lighting and clear visibility</li>
                            <li>• Position the camera to capture your full performance</li>
                            <li>• Follow the drill instructions carefully</li>
                            <li>• Record for the full duration as specified</li>
                            <li>• Review your recording before submitting</li>
                        </ul>
                    </div>

                    {/* Toast Notification */}
                    {showToast && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Video submitted successfully!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
