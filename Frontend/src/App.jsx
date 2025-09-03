import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

// Components
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
import Template from "./components/Template";
import FormPage from "./components/FormPage";
import Gallery from "./components/Gallery";
import Docstemplate from "./components/Docstemplate.jsx";
import Docsgallery from "./components/Docsgallery.jsx";
import JobApplicationForm from "./components/JobApplication.jsx";
import SlideGallery from "./components/SlideGallery.jsx";
import Slidetemplate from "./components/Slidetemplate.jsx";

// Temporary components
const Docs = () => <h2 className="p-3">Docs Page</h2>;
const Sheets = () => <h2 className="p-3">Sheets Page</h2>;
const Forms = () => <h2 className="p-3">Forms Page</h2>;

function AppWrapper() {
  const location = useLocation();

  // Hide header on these routes
  const hideHeaderPaths = ["/question", "/responses", "/settings", "/templategallery", "/slide"];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Main Routes */}
        <Route path="/docs" element={<Docs />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path="/slidetemplate" element={<Slidetemplate />} />
        <Route path="/forms" element={<Forms />} />

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
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/docstemplate" element={<Docstemplate />} />
        <Route path="/docsgallery" element={<Docsgallery />} />
        <Route path="/SlideGallery" element={<SlideGallery />} />

        {/* Blank Form with child pages */}
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
              <Response />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <BlankForm />
              <Setting />
            </>
          }
        />

        {/* Job application form */}
        <Route path="/form/jobapplication" element={<JobApplicationForm />} />
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
