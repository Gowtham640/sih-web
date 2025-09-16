'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { supabase, Coach, Athlete, Drill } from '@/lib/supabase';

export default function AssignPage() {
    const router = useRouter();
    const [coach, setCoach] = useState<Coach | null>(null);
    const [availableAthletes, setAvailableAthletes] = useState<Athlete[]>([]);
    const [assignedAthletes, setAssignedAthletes] = useState<Athlete[]>([]);
    const [coachDrills, setCoachDrills] = useState<Drill[]>([]);
    const [selectedAthlete, setSelectedAthlete] = useState<string>('');
    const [selectedDrill, setSelectedDrill] = useState<string>('');
    const [drillGoal, setDrillGoal] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const initializeData = async () => {
            const storedCoach = localStorage.getItem('coach_user');
            if (!storedCoach) {
                router.push('/');
                return;
            }

            const coachData = JSON.parse(storedCoach);
            setCoach(coachData);

            await Promise.all([
                loadAvailableAthletes(),
                loadAssignedAthletes(coachData.id),
                loadCoachDrills(coachData.id)
            ]);

            setIsLoading(false);
        };

        initializeData();
    }, [router]);

    const loadAvailableAthletes = async () => {
        const { data, error } = await supabase
            .from('athletes')
            .select('*')
            .order('name');

        if (data && !error) {
            setAvailableAthletes(data);
        }
    };

    const loadAssignedAthletes = async (coachId: number) => {
        const { data, error } = await supabase
            .from('coach_athletes')
            .select(`
                athletes (*)
            `)
            .eq('coach_id', coachId);

        if (data && !error) {
            const athletes = data.map(item => item.athletes).filter(Boolean);
            setAssignedAthletes(athletes as Athlete[]);
        }
    };

    const loadCoachDrills = async (coachId: number) => {
        const { data, error } = await supabase
            .from('drills')
            .select('*')
            .eq('coach_id', coachId)
            .order('created_at', { ascending: false });

        if (data && !error) {
            setCoachDrills(data);
        }
    };

    const assignAthleteToCoach = async (athleteId: number) => {
        if (!coach) return;

        const { error } = await supabase
            .from('coach_athletes')
            .insert([{
                coach_id: coach.id,
                athlete_id: athleteId
            }]);

        if (!error) {
            await loadAssignedAthletes(coach.id);
            setToastMessage('Athlete assigned successfully!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } else {
            alert('Failed to assign athlete. They may already be assigned to you.');
        }
    };

    const assignDrillToAthlete = async () => {
        if (!selectedAthlete || !selectedDrill || !drillGoal || !dueDate || !coach) {
            alert('Please fill in all required fields');
            return;
        }

        const { error } = await supabase
            .from('drill_assignments')
            .insert([{
                drill_id: parseInt(selectedDrill),
                athlete_id: parseInt(selectedAthlete),
                assigned_by: coach.id,
                due_date: dueDate,
                status: 'pending'
            }]);

        if (!error) {
            setToastMessage('Drill assigned successfully!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Reset form
            setSelectedAthlete('');
            setSelectedDrill('');
            setDrillGoal('');
            setDueDate('');
        } else {
            alert('Failed to assign drill. This athlete may already have this drill assigned.');
        }
    };

    const filteredAvailableAthletes = availableAthletes.filter(athlete =>
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !assignedAthletes.some(assigned => assigned.id === athlete.id)
    );

    const selectedAthleteData = assignedAthletes.find(athlete => athlete.id.toString() === selectedAthlete);
    const selectedDrillData = coachDrills.find(drill => drill.id.toString() === selectedDrill);

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
            <div className="bg-white px-8 py-8">
                <div className="w-full max-w-none">

                    {/* Available Athletes to Assign */}
                    <div className="mb-8">
                        <h2 className="text-gray-800 font-sans font-bold mb-4 text-2xl text-center">
                            Available Athletes to Assign
                        </h2>

                        {/* Search Bar */}
                        <div className="mb-6 max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Search athletes by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAvailableAthletes.map(athlete => (
                                <div
                                    key={athlete.id}
                                    className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {athlete.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{athlete.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{athlete.email}</p>

                                        <button
                                            onClick={() => assignAthleteToCoach(athlete.id)}
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300"
                                        >
                                            Assign to Me
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredAvailableAthletes.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                {searchTerm ? 'No athletes found matching your search.' : 'All athletes are already assigned to you.'}
                            </div>
                        )}
                    </div>

                    {/* Assigned Athletes */}
                    <div className="mb-8">
                        <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                            Your Assigned Athletes
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {assignedAthletes.map(athlete => (
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
                                                {athlete.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{athlete.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{athlete.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {assignedAthletes.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                No athletes assigned yet. Search and assign athletes from above.
                            </div>
                        )}
                    </div>

                    {/* Drill Assignment Form */}
                    {selectedAthleteData && (
                        <div className="bg-white border-4 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 mb-6">
                            <h2 className="text-gray-800 font-sans font-bold mb-6 text-2xl text-center">
                                Assign Drill to {selectedAthleteData.name}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Drill Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Your Drill *
                                    </label>
                                    <select
                                        value={selectedDrill}
                                        onChange={(e) => setSelectedDrill(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">Choose a drill...</option>
                                        {coachDrills.map(drill => (
                                            <option key={drill.id} value={drill.id}>
                                                {drill.name}
                                            </option>
                                        ))}
                                    </select>

                                    {coachDrills.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            No drills found. <button onClick={() => router.push('/coach/upload')} className="text-purple-600 underline">Create one first</button>.
                                        </p>
                                    )}
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
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Custom Goal */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Set Specific Goal for This Assignment *
                                </label>
                                <input
                                    type="text"
                                    value={drillGoal}
                                    onChange={(e) => setDrillGoal(e.target.value)}
                                    placeholder="e.g., Complete 10 repetitions with perfect form"
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
                                        <p><strong>Original Goal:</strong> {selectedDrillData.goal}</p>
                                        <p><strong>Assignment Goal:</strong> {drillGoal}</p>
                                        {dueDate && <p><strong>Due Date:</strong> {dueDate}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Assign Button */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={assignDrillToAthlete}
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
                                <span>{toastMessage}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
