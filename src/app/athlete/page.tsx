"use client";
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function AthleteRedirect() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.type === 'athlete') {
            router.push('/athlete/dashboard');
        } else {
            router.push('/athlete/login');
        }
    }, [user, router]);
    return (
        <div className='bg-white w-full h-screen flex items-center justify-center'>
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting...</p>
            </div>
                </div>
    );
}
