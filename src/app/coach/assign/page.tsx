'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

export default function AssignPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedAthlete, setSelectedAthlete] = useState<string>('');
    const [selectedDrill, setSelectedDrill] = useState<string>('');
    const [drillGoal, setDrillGoal] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [showToast, setShowToast] = useState(false);
    const [athletes, setAthletes] = useState<any[]>([]);
    const [drills, setDrills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.type !== 'coach') {
            router.push('/coach/login');
            return;
        }
        fetchData();
    }, [user, router]);

    const fetchData = async () => {
        if (!user) return;

        try {
            // Fetch athletes assigned to this coach
            const { data: coachAthletes, error: athletesError } = await supabase
                .from('coach_athletes')
                .select(`
                    athlete_id,
                    athletes (
                        id,
                        name,
                        grade,
                        sport
                    )
                `)
                .eq('coach_id', user.id);

            if (athletesError) throw athletesError;

            // Fetch drills created by this coach
            const { data: coachDrills, error: drillsError } = await supabase
                .from('drills')
                .select('*')
                .eq('coach_id', user.id);

            if (drillsError) throw drillsError;

            setAthletes(coachAthletes?.map(ca => ca.athletes).filter(Boolean) || []);
            setDrills(coachDrills || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleAssignDrill = async () => {
        if (!selectedAthlete || !selectedDrill || !drillGoal || !dueDate || !user) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const { error } = await supabase
                .from('drill_assignments')
                .insert({
                    coach_id: user.id,
                    athlete_id: parseInt(selectedAthlete),
                    drill_id: parseInt(selectedDrill),
                    due_date: dueDate,
                    custom_goal: drillGoal,
                    status: 'assigned'
                });

            if (error) throw error;

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset form
            setSelectedAthlete('');
            setSelectedDrill('');
            setDrillGoal('');
            setDueDate('');
        } catch (error) {
            console.error('Error assigning drill:', error);
            alert('Failed to assign drill. Please try again.');
        }
    };

    const selectedAthleteData = athletes.find(athlete => athlete.id === parseInt(selectedAthlete));
    const selectedDrillData = drills.find(drill => drill.id === parseInt(selectedDrill));

    return (
        <div className='bg-white w-full h-screen'>
            {/* Gradient Header */}
                        <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 h-1/5 flex items-center justify-center">
                <p className='absolute text-white font-sans font-bold text-5xl'>Assign Tests & Drills</p>
                <button
                    onClick={() => router.push('/coach/dashboard')}
                    className="absolute right-3 font-roboto font-medium text-lg flex text-center bg-white text-blue-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Back to Dashboard
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
                        {loading ? (
                            <div className="text-center">Loading athletes...</div>
                        ) : athletes.length === 0 ? (
                            <div className="text-center text-gray-600">
                                <p>No athletes assigned to you yet.</p>
                                <p className="text-sm mt-2">Please contact your administrator to assign athletes.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {athletes.map(athlete => (
                                    <div
                                        key={athlete.id}
                                        className={`bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${
                                            selectedAthlete === athlete.id.toString() ? 'border-purple-500 bg-purple-50' : ''
                                        }`}
                                        onClick={() => setSelectedAthlete(athlete.id.toString())}
                                    >
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {athlete.name.split(' ').map((n: string) => n[0]).join('')}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-2">{athlete.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{athlete.grade} • {athlete.sport}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                        {drills.map(drill => (
                                            <option key={drill.id} value={drill.id}>
                                                {drill.name}
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
                                        <p><strong>Default Goal:</strong> {selectedDrillData.goal}</p>
                                        <p><strong>Custom Goal:</strong> {drillGoal}</p>
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
