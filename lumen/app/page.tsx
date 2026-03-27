"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Upload, BookOpen, MessageCircle, Trophy, Star } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import GamificationPanel from './components/GamificationPanel';

export default function Home() {
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [vectorStoreBuilt, setVectorStoreBuilt] = useState(false);
  const [points, setPoints] = useState(0);

  const handleUploadSuccess = () => {
    setFilesUploaded(true);
    setPoints(prev => prev + 10); // Gamificação: pontos por upload
  };

  const handleBuildSuccess = () => {
    setVectorStoreBuilt(true);
    setPoints(prev => prev + 20); // Pontos por build
  };

  const handleQuerySuccess = () => {
    setPoints(prev => prev + 5); // Pontos por pergunta
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/primary_logo.png"
                alt="Lumen Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <h1 className="text-2xl font-bold text-gray-900">Lumen</h1>
              <span className="text-sm text-gray-600">AI-Powered Study Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-700">{points} Points</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Welcome to Lumen</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Upload your study documents, build your knowledge base, and get AI-powered answers to your questions.
                Earn points as you learn and unlock achievements!
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Upload className="w-4 h-4" />
                  <span>Upload PDFs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Build Knowledge Base</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask Questions</span>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              filesUploaded={filesUploaded}
            />

            {/* Build Vector Store */}
            {filesUploaded && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Build Knowledge Base</h3>
                <p className="text-gray-600 mb-4">
                  Process your uploaded documents to create a searchable knowledge base.
                </p>
                <button
                  onClick={handleBuildSuccess}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Build Vector Store
                </button>
                {vectorStoreBuilt && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">✓ Knowledge base built successfully!</p>
                  </div>
                )}
              </div>
            )}

            {/* Chat Interface */}
            {vectorStoreBuilt && (
              <ChatInterface onQuerySuccess={handleQuerySuccess} />
            )}
          </div>

          {/* Gamification Panel */}
          <div className="lg:col-span-1">
            <GamificationPanel points={points} />
          </div>
        </div>
      </div>
    </div>
  );
}
