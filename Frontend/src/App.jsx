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

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
