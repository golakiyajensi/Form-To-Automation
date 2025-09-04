<<<<<<< HEAD
// import Template from "./components/Template";
// // import FormPage from "./components/FormPage";
// import "../src/index.css";
// import Gallery from "./components/Gallery";
// import MainBody from "./components/MainBody";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";


// import { useState } from 'react'
// import './App.css'
// import Header from './screen/Header'

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js"; // required for dropdown behavior
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import "./CSS/style.css";

// import Signin from "./Components/Signin.jsx";
// import UseAccount from "./Components/UseAccount.jsx";
// import Password from "./Components/Pasword.jsx";
// import ForgotPassword from "./Components/ForgotPassword.jsx";

// import SheetGallery from "./Components/SheetGallery.jsx";
// import TemplateGallery from './Components/TemplateGallery.jsx';
// // import FormBuilder from "./Components/FormPage.jsx";
// import FormPage from "./Components/FormPage.jsx";
// import Register from "./Components/register.jsx";
// import Login from "./Components/login.jsx";
// import Dashboard from "./Components/dashboard.jsx";
// import FormBuilder from "./Components/formbuilder.jsx";
// // import { AuthProvider } from "./context/authcontext.jsx";

// import { AuthProvider } from "./context/authcontext.jsx"; // adjust path if needed

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Header />
//         <Routes>
//           <Route path='/dd' element={<Dashboard/>}></Route>
//           <Route path='/register' element={<Register/>}></Route>
//           <Route path='/' element={<Login/>}></Route>
//           <Route path='/create' element={<FormBuilder/>}></Route>
//           <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
//           <Route path='/sheetgallery' element={<SheetGallery/>}></Route>
//           <Route path='/templategallery' element={<TemplateGallery/>}></Route>
//           <Route path="/gallery" element={<Gallery />} />
//           <Route path="/form/:id" element={<FormPage/>} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



import { useState, useEffect } from 'react';
import Layout from './Components/Layout.jsx';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import FormBuilder from './Components/FormBuilder.jsx';
import FormViewer from './Components/FormViewer.jsx';
import ResponseViewer from './Components/ResponseViewer.jsx';
import './App.css';
=======
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

// Components
import Header from "./screen/Header.jsx";
import Signin from "./Components/Signin.jsx";
import UseAccount from "./Components/UseAccount.jsx";
import Password from "./Components/Pasword.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import SheetGallery from "./Components/SheetGallery.jsx";
import TemplateGallery from "./Components/TemplateGallery.jsx";
import BlankForm from "./Components/BlankForm.jsx";
import Form from "./Components/Forms.jsx";
import Response from "./Components/Response.jsx";
import Setting from "./Components/Setting.jsx";
import Template from "./components/Template.jsx";
import FormPage from "./components/FormPage.jsx";
import Gallery from "./components/Gallery.jsx";
import SheetGallery from "./components/SheetGallery.jsx";
import TemplateGallery from "./components/TempateGallery.jsx";
import Docstemplate from "./components/Docstemplate.jsx";
import Docsgallery from "./components/Docsgallery.jsx";
import JobApplicationForm from "./components/JobApplication.jsx";
import SlideGallery from "./components/SlideGallery.jsx";
import Slidetemplate from "./components/Slidetemplate.jsx";
import RsvpForm from "./components/RsvpForm.jsx";

function AppWrapper() {
  const location = useLocation();

  // Hide header on these routes
  const hideHeaderPaths = ["/question", "/responses", "/settings", "/templategallery", "/slide", "/gallery"];

  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Main Routes */}
        <Route path="/forms" element={<Form />} />
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/form/jobapplication" element={<JobApplicationForm />} />
        <Route path="/form/rsvpform" element={<RsvpForm />} />

        {/* Docs & Sheets */}
        <Route path="/docstemplate" element={<Docstemplate />} />
        <Route path="/docsgallery" element={<Docsgallery />} />
        <Route path="/sheets" element={<SheetGallery />} />
        <Route path="/slidetemplate" element={<Slidetemplate />} />
        <Route path="/slidegallery" element={<SlideGallery />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/useaccount" element={<UseAccount />} />
        <Route path="/password" element={<Password />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Extra Routes */}
        <Route path="/sheetgallery" element={<SheetGallery />} />
        <Route path="/templategallery" element={<TemplateGallery />} />
        <Route path="/formgallery" element={<Template />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blankform" element={<BlankForm />} />
        <Route path="/response" element={<Response />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </>
  );
}
>>>>>>> main

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
<<<<<<< HEAD
    <Layout 
      currentUser={currentUser}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentPage={currentPage}
    >
      {renderCurrentPage()}
    </Layout>
=======
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
>>>>>>> main
  );
}

export default App;
  