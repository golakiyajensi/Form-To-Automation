import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./CSS/style.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Header from "./screen/Header";
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

// Wrapper component to conditionally show header
function Layout({ children }) {
  const location = useLocation();
  const hideHeaderPaths = ["/question", "/responses", "/settings", "/templategallery"];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Pages without BlankForm */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/useaccount" element={<UseAccount />} />
          <Route path="/password" element={<Password />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/sheetgallery" element={<SheetGallery />} />
          
          {/* Page where Header is hidden but BlankForm is visible */}
          <Route
            path="/templategallery"
            element={<TemplateGallery />}
          />
          <Route
            path="/question"
            element={
              <>
                <BlankForm />
                <Form />
              </>
            }
          />
          <Route
            path="/responses"
            element={
              <>
                <BlankForm />
                <Response/>
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <BlankForm />
                <Setting/>
              </>
            }
          />

          {/* Fallback route */}
          <Route path="signin" element={<Signin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
