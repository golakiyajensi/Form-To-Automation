// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';

// Components
import Header from './screen/Header';
import SlideGallery from './components/Slidetemplate';
import Signin from "./Components/Signin.jsx";
import UseAccount from "./Components/UseAccount.jsx";
import Password from "./Components/Pasword.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";

import Template from "./components/Template";
import FormPage from "./components/FormPage";
import Gallery from "./components/Gallery";
import SheetGallery from "./Components/SheetGallery.jsx";
import TemplateGallery from './Components/TemplateGallery.jsx';
import Docstemplate from "./components/Docstemplate.jsx";
import Docsgallery from "./components/Docsgallery.jsx";

// Temporary components
const Docs = () => <h2 className="p-3">Docs Page</h2>;
const Sheets = () => <h2 className="p-3">Sheets Page</h2>;
const Forms = () => <h2 className="p-3">Forms Page</h2>;

function AppWrapper() {
  const location = useLocation();

  // Hide header only on Slide page
  const hideHeader = location.pathname === "/slide"; 

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        {/* Main Routes */}
        <Route path="/docs" element={<Docs />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path="/slide" element={<SlideGallery />} />
        <Route path="/forms" element={<Forms />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/useaccount" element={<UseAccount />} />
        <Route path="/password" element={<Password />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Extra Routes from main */}
        <Route path='/sheetgallery' element={<SheetGallery />} />
        <Route path='/templategallery' element={<TemplateGallery />} />
        <Route path="/formgallery" element={<Template />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/docstemplate" element={<Docstemplate />} />
        <Route path="/docsgallery" element={<Docsgallery />} />
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
