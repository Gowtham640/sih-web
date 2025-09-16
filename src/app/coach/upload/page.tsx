'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { supabase, Coach } from '@/lib/supabase';
import { testStorageConnection } from '@/lib/testStorage';

export default function UploadPage() {
    const router = useRouter();
    const [coach, setCoach] = useState<Coach | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [drillName, setDrillName] = useState('');
    const [drillGoal, setDrillGoal] = useState('');
    const [instructions, setInstructions] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState<string>('');

    useEffect(() => {
        const storedCoach = localStorage.getItem('coach_user');
        if (!storedCoach) {
            router.push('/');
            return;
        }
        setCoach(JSON.parse(storedCoach));
        setIsLoading(false);
    }, [router]);

    const handleFileSelect = (file: File) => {
        // Validate file type and size
        const validTypes = [
            'video/mp4',
            'video/avi',
            'video/mov',
            'video/quicktime',
            'video/x-msvideo',
            'image/jpeg',
            'image/png',
            'image/jpg'
        ];
        const maxSize = 100 * 1024 * 1024; // 100MB

        console.log('File type:', file.type, 'File size:', file.size);

        if (!validTypes.includes(file.type)) {
            alert(`Please select a valid video or image file. \nAccepted formats: MP4, AVI, MOV, JPG, PNG\nYour file type: ${file.type}`);
            return;
        }

        if (file.size > maxSize) {
            alert(`File size must be less than 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            return;
        }

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

        const uploadFileToSupabase = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `coach_${coach?.id}_${Date.now()}.${fileExt}`;

            console.log('Attempting to upload file:', fileName, 'Size:', file.size, 'Type:', file.type);

            // Simple upload without folder structure
            const { data, error } = await supabase.storage
                .from('drill-media')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            console.log('Upload result:', data, 'Error:', error);

            if (error) {
                console.error('Upload error details:', error);
                // Try with upsert true if it fails
                const { data: data2, error: error2 } = await supabase.storage
                    .from('drill-media')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: true // Allow overwrite
                    });

                if (error2) {
                    console.error('Second upload attempt error:', error2);
                    return null;
                }

                console.log('Second upload successful:', data2);

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('drill-media')
                    .getPublicUrl(fileName);

                return urlData.publicUrl;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('drill-media')
                .getPublicUrl(fileName);

            console.log('Public URL:', urlData.publicUrl);
            return urlData.publicUrl;
        } catch (error) {
            console.error('File upload failed:', error);
            return null;
        }
    };

    const handleAddDrill = async () => {
        if (!drillName || !drillGoal || !instructions || !coach) {
            alert('Please fill in all required fields');
            return;
        }

        setIsUploading(true);
        setUploadProgress('Preparing upload...');

        try {
            let videoUrl = null;

            // Upload file if one is selected
            if (selectedFile) {
                setUploadProgress('Uploading media file...');
                videoUrl = await uploadFileToSupabase(selectedFile);
                if (!videoUrl) {
                    alert('Failed to upload media file. Please check your file format and size, then try again.');
                    setIsUploading(false);
                    setUploadProgress('');
                    return;
                }
                setUploadProgress('Media uploaded successfully!');
            }

            // Create drill record in database
            setUploadProgress('Saving drill information...');
            const { data, error } = await supabase
                .from('drills')
                .insert([{
                    coach_id: coach.id,
                    name: drillName,
                    goal: drillGoal,
                    instructions: instructions,
                    video_url: videoUrl
                }])
                .select()
                .single();

            if (error) {
                console.error('Database error:', error);
                alert('Failed to create drill. Please try again.');
                setIsUploading(false);
                setUploadProgress('');
                return;
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset form
            setDrillName('');
            setDrillGoal('');
            setInstructions('');
            setSelectedFile(null);
            setUploadProgress('');

        } catch (error) {
            console.error('Error creating drill:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress('');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white w-full h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className='bg-white w-full min-h-screen'>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>Upload Reference Video</p>
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
            <div className="bg-white px-8 py-8">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Drill Creation Form */}
                    <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-8">
                        <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                            Create New Training Drill
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
                                    disabled={isUploading}
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
                                    disabled={isUploading}
                                />
                            </div>

                            {/* Instructions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Detailed Instructions *
                                </label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Provide detailed step-by-step instructions for the drill..."
                                    rows={4}
                                    className="w-full border text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                    disabled={isUploading}
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
                                    } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                                                    disabled={isUploading}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Supports MP4, AVI, MOV, JPG, PNG formats (Max 100MB)
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
                                                disabled={isUploading}
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="m100 50 4 25H0Z"></path>
                                        </svg>
                                        <span className="text-blue-800 font-medium">{uploadProgress}</span>
                                    </div>
                                </div>
                            )}

                            {/* Preview of drill data */}
                            {drillName && drillGoal && instructions && !isUploading && (
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <h3 className="font-medium text-purple-900 mb-2">Drill Preview</h3>
                                    <div className="text-sm text-purple-800 space-y-1">
                                        <p><strong>Name:</strong> {drillName}</p>
                                        <p><strong>Goal:</strong> {drillGoal}</p>
                                        <p><strong>Instructions:</strong> {instructions.substring(0, 100)}...</p>
                                        <p><strong>Media:</strong> {selectedFile ? selectedFile.name : 'No media file'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Add Drill Button */}
                        <div className="mt-8 text-center space-y-4">
                            <button
                                onClick={handleAddDrill}
                                disabled={isUploading || !drillName || !drillGoal || !instructions}
                                className="bg-gradient-to-r from-purple-900 to-blue-900 text-white px-10 py-4 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isUploading ? (
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="m100 50 4 25H0Z"></path>
                                        </svg>
                                        <span>Creating Drill...</span>
                                    </div>
                                ) : (
                                    'Create Drill'
                                )}
                            </button>

                            {/* Test Storage Button - for debugging */}
                            <button
                                onClick={async () => {
                                    console.log('Testing storage connection...');
                                    const results = await testStorageConnection();
                                    console.log('Storage test results:', results);
                                    alert(`Storage Test Results:\nBuckets: ${results.bucketsTest}\nList: ${results.listTest}\nUpload: ${results.uploadTest}`);
                                }}
                                disabled={isUploading}
                                className="ml-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm"
                            >
                                Test Storage
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
                                <span>Drill created successfully!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
