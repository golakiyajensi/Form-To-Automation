// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "./App.css";

// // Components
// import Header from "./screen/Header.jsx";
// import Signin from "./Components/Signin.jsx";
// import UseAccount from "./Components/UseAccount.jsx";
// import Password from "./Components/Pasword.jsx";
// import ForgotPassword from "./Components/ForgotPassword.jsx";
// import SheetGallery from "./Components/SheetGallery.jsx";
// import TemplateGallery from "./Components/TemplateGallery.jsx";
// import BlankForm from "./Components/BlankForm.jsx";
// import Question from "./Components/Forms.jsx";
// import Response from "./Components/Response.jsx";
// import Setting from "./Components/Setting.jsx";
// import Template from "./components/Template.jsx";
// import FormPage from "./components/FormPage.jsx";
// import Gallery from "./components/Gallery.jsx";
// // import SheetGallery from "./components/SheetGallery.jsx";
// // import TemplateGallery from "./components/TempateGallery.jsx";
// import Docstemplate from "./components/Docstemplate.jsx";
// import Docsgallery from "./components/Docsgallery.jsx";
// import JobApplicationForm from "./components/JobApplication.jsx";
// import SlideGallery from "./components/SlideGallery.jsx";
// import Slidetemplate from "./components/Slidetemplate.jsx";
// import RsvpForm from "./components/RsvpForm.jsx";
// // import Question from "./components/Forms.jsx";

// function AppWrapper() {
//   const location = useLocation();

//   // Hide header on these routes
//   const hideHeaderPaths = ["/question", "/responses", "/settings", "/templategallery", "/slide", "/gallery"];
//   const showHeader = !hideHeaderPaths.includes(location.pathname);

//   return (
//     <>
//       {showHeader && <Header />}
//       <Routes>
//         {/* Main Routes */}
//         {/* <Route path="/forms" element={<Form />} /> */}
//         <Route path="/form/:id" element={<FormPage />} />
//         <Route path="/form/jobapplication" element={<JobApplicationForm />} />
//         <Route path="/form/rsvpform" element={<RsvpForm />} />

//         {/* Docs & Sheets */}
//         <Route path="/docstemplate" element={<Docstemplate />} />
//         <Route path="/docsgallery" element={<Docsgallery />} />
//         <Route path="/sheets" element={<SheetGallery />} />
//         <Route path="/slidetemplate" element={<Slidetemplate />} />
//         <Route path="/slidegallery" element={<SlideGallery />} />

//         {/* Auth Routes */}
//         <Route path="/signin" element={<Signin />} />
//         <Route path="/useaccount" element={<UseAccount />} />
//         <Route path="/password" element={<Password />} />
//         <Route path="/forgotpassword" element={<ForgotPassword />} />

//         {/* Extra Routes */}
//         <Route path="/sheetgallery" element={<SheetGallery />} />
//         <Route path="/templategallery" element={<TemplateGallery />} />
//         <Route path="/formgallery" element={<Template />} />
//         <Route path="/gallery" element={<Gallery />} />
//         <Route path="/blankform" element={<BlankForm />} />
//         <Route path="/response" element={<Response />} />
//         <Route path="/settings" element={<Setting />} />
//         <Route path="/question" element={<Question/>} />
//       </Routes>
//     </>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AppWrapper />
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import "./CSS/style.css";

// Components
import Header from "./screen/Header";
import Signin from "./Components/Signin.jsx";
import UseAccount from "./Components/UseAccount.jsx";
import Password from "./Components/Password.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import SheetGallery from "./components/SheetGallery.jsx";
import TemplateGallery from "./components/TemplateGallery.jsx";
import BlankForm from "./Components/BlankForm.jsx";
import Form from "./Components/Forms.jsx";
import Response from "./Components/Response.jsx";
import Setting from "./Components/Setting.jsx";

import Template from "./components/Template.jsx";
import FormPage from "./components/FormPage.jsx";
import Gallery from "./components/Gallery.jsx";

import Docstemplate from "./components/Docstemplate.jsx";
import Docsgallery from "./components/Docsgallery.jsx";
import JobApplicationForm from "./components/JobApplication.jsx";
import SlideGallery from "./components/SlideGallery.jsx";
import Slidetemplate from "./components/Slidetemplate.jsx";

import RSVP from "./components/RsvpForm.jsx";
import Quiz from "./components/Quiz.jsx";

// Placeholder components
const Docs = () => <h2 className="p-3">Docs Page</h2>;
const Sheets = () => <h2 className="p-3">Sheets Page</h2>;
const Forms = () => <h2 className="p-3">Forms Page</h2>;

function AppWrapper() {
  const location = useLocation();

  // Hide header on these routes
  const hideHeaderPaths = [
    "/question",
    "/responses",
    "/settings",
    "/templategallery",
    "/slide",
    "/gallery",
    "/form/rsvp",
    "/quiz",
  ];

  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Slidetemplate />} />
        <Route path="/forms" element={<Form />} />
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/form/jobapplication" element={<JobApplicationForm />} />

        {/* Docs & Sheets */}
        <Route path="/docs" element={<Docs />} />
        <Route path="/docstemplate" element={<Docstemplate />} />
        <Route path="/docsgallery" element={<Docsgallery />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path="/sheetgallery" element={<SheetGallery />} />

        {/* Slides */}
        <Route path="/slidetemplate" element={<Slidetemplate />} />
        <Route path="/slidegallery" element={<SlideGallery />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/useaccount" element={<UseAccount />} />
        <Route path="/password" element={<Password />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Extra Routes */}
        <Route path="/templategallery" element={<TemplateGallery />} />
        <Route path="/formgallery" element={<Template />} />
        <Route path="/gallery" element={<Gallery />} />

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

        {/* RSVP Form */}
        <Route
          path="/form/rsvp"
          element={
            <>
              <BlankForm />
              <RSVP />
            </>
          }
        />

        {/* Quiz */}
        <Route
          path="/quiz"
          element={
            <>
              <BlankForm />
              <Quiz />
            </>
          }
        />
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
