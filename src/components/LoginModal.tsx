"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'coach' | 'athlete';
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, userType, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const tableName = userType === 'coach' ? 'coaches' : 'athletes';

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem(`${userType}_user`, JSON.stringify(data));
      onLoginSuccess(data);
      onClose();

    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {userType} Login
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`Enter your ${userType} username`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-900 to-blue-900 text-white py-3 rounded-lg font-medium hover:from-purple-800 hover:to-blue-800 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Sample Credentials:</p>
          {userType === 'coach' ? (
            <div className="text-xs text-gray-500">
              <p><strong>Coach 1:</strong> coach1 / password123</p>
              <p><strong>Coach 2:</strong> coach2 / password123</p>
              <p><strong>Coach 3:</strong> coach3 / password123</p>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              <p><strong>Athlete 1:</strong> athlete1 / password123</p>
              <p><strong>Athlete 2:</strong> athlete2 / password123</p>
              <p><strong>Athlete 3:</strong> athlete3 / password123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
