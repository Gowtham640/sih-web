'use client';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [drillName, setDrillName] = useState('');
    const [drillGoal, setDrillGoal] = useState('');
    const [instructions, setInstructions] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // const handleUpload = () => {
    //     if (selectedFile) {
    //         // Handle file upload logic here
    //         console.log('Uploading file:', selectedFile.name);
    //         // You can add actual upload logic here
    //     }
    // };

    const handleAddDrill = () => {
        if (drillName && drillGoal && instructions) {
            // Handle drill creation logic here
            console.log('Creating drill:', { drillName, drillGoal, instructions, selectedFile });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            // Reset form
            setDrillName('');
            setDrillGoal('');
            setInstructions('');
            setSelectedFile(null);
        } else {
            alert('Please fill in all required fields');
        }
    };

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>Upload Reference Video</p>
                <button 
                    onClick={() => router.push('/coach')} 
                    className="absolute right-3 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Back to Dashboard
                </button>
            </div>
            
            {/* Main Content Area */}
            <div className="bg-white px-8 py-8 h-auto">
                <div className="w-full max-w-none">
                    {/* Drill Creation Form */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-8">
                        <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                            Create New Drill
                        </h2>
                        
                        <div className="space-y-6">
                            {/* Drill Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name of the Drill *
                                </label>
                                <input
                                    type="text"
                                    value={drillName}
                                    onChange={(e) => setDrillName(e.target.value)}
                                    placeholder="e.g., Basketball Free Throw Practice"
                                    className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Drill Goal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Goal of the Drill *
                                </label>
                                <input
                                    type="text"
                                    value={drillGoal}
                                    onChange={(e) => setDrillGoal(e.target.value)}
                                    placeholder="e.g., Improve shooting accuracy by 20%"
                                    className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Instructions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instructions *
                                </label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Provide detailed step-by-step instructions for the drill..."
                                    rows={4}
                                    className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                />
                            </div>

                            {/* Media Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Reference Media (Optional)
                                </label>
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                                        dragActive 
                                            ? 'border-purple-500 bg-purple-50 scale-105' 
                                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-3">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">
                                                Drag and drop your media file here, or
                                            </p>
                                            <label className="cursor-pointer">
                                                <span className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200">
                                                    browse to choose a file
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="video/*,image/*"
                                                    onChange={handleFileInput}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Supports MP4, AVI, MOV, JPG, PNG formats
                                        </p>
                                    </div>
                                </div>

                                {/* Selected File Display */}
                                {selectedFile && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedFile(null)}
                                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Drill Button */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleAddDrill}
                                className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-10 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Add Drill
                            </button>
                        </div>
                    </div>

                    {/* Toast Notification */}
                    {showToast && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
                            <div className="flex items-center space-x-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Drill added successfully!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
