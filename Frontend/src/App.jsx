// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';
import Header from './screen/Header';
import SlideGallery from './components/Slidetemplate';

// Temporary components (replace with real ones later)
const Docs = () => <h2 className="p-3">Docs Page</h2>;
const Sheets = () => <h2 className="p-3">Sheets Page</h2>;
const Forms = () => <h2 className="p-3">Forms Page</h2>;

function AppWrapper() {
  const location = useLocation();

  const hideHeader = location.pathname === "/slide"; 

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/docs" element={<Docs />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path="/slide" element={<SlideGallery />} />
        <Route path="/forms" element={<Forms />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
