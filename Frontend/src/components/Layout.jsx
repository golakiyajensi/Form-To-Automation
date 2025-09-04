import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { LogOut, User, FileText, Plus } from 'lucide-react';

const Layout = ({ children, currentUser, onLogout, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                Google Forms Clone
              </h1>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'dashboard' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="inline w-4 h-4 mr-1" />
                  My Forms
                </button>
                <button 
                  onClick={() => onNavigate('create')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'create' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Plus className="inline w-4 h-4 mr-1" />
                  Create Form
                </button>
              </nav>
            </div>
            
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{currentUser.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {currentUser.role}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

