import { useState, useEffect } from 'react';
import Layout from './components/Layout.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import FormBuilder from './components/FormBuilder.jsx';
import FormViewer from './components/FormViewer.jsx';
import ResponseViewer from './components/ResponseViewer.jsx';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(data.data);
      }
    } catch (err) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      setCurrentUser(null);
      setCurrentPage('dashboard');
      setSelectedFormId(null);
    }
  };

  const handleNavigate = (page, formId = null) => {
    setCurrentPage(page);
    setSelectedFormId(formId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            currentUser={currentUser} 
            onNavigate={handleNavigate}
          />
        );
      case 'create':
        return (
          <FormBuilder 
            onNavigate={handleNavigate}
          />
        );
      case 'edit':
        return (
          <FormBuilder 
            formId={selectedFormId}
            onNavigate={handleNavigate}
          />
        );
      case 'view':
        return (
          <FormViewer 
            formId={selectedFormId}
            onNavigate={handleNavigate}
          />
        );
      case 'responses':
        return (
          <ResponseViewer 
            formId={selectedFormId}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <Dashboard 
            currentUser={currentUser} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentUser={currentUser}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentPage={currentPage}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
