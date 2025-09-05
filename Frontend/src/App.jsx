import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import "./CSS/style.css";

// Components
import Header from "./screen/Header";
import Signin from "./Components/Signin.jsx";
import UseAccount from "./Components/UseAccount.jsx";
import Password from "./Components/Pasword.jsx";
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


import RsvpForm from "./components/RsvpForm.jsx";  
import Quiz from "./components/Quiz.jsx";
import PartyInviteForm from "./components/PartyInvite.jsx";
import OrderForm from "./components/Orderform.jsx";
import EventFeedbackForm from "./components/Eventfeedback.jsx";
import TShirtForm from "./components/T-shirtsignup.jsx";

import RSVP from "./components/RsvpForm.jsx";
import Quiz from "./components/Quiz.jsx";
import PartyInvite from "./components/PartyInvite.jsx";
import ExitTicket from "./components/ExitTicket.jsx";
import Feedback from "./components/Feedback.jsx";
import Assesment from "./components/Assesment.jsx";
import TimeOffRequest from "./components/TimeOffRequest.jsx";
import WorkRequest from "./components/WorkRequest.jsx";
import Worksheet from "./components/Worksheet.jsx";




// Temporary components
const Docs = () => <h2 className="p-3">Docs Page</h2>;
const Sheets = () => <h2 className="p-3">Sheets Page</h2>;


function AppWrapper() {
  const location = useLocation();

  // Hide header on these routes
  const hideHeaderPaths = ["/question", "/responses", "/settings", "/templategallery", "/slide", "/gallery", "/form/rsvp", "/quiz", "/assesment", "/timeoffrequest", "/workrequest", "/form/jobapplication"];

  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Template />} />
        <Route path="/forms" element={<Form />} />
        <Route path="/form/:id" element={<FormPage />} />

        <Route path="/form/jobapplication" element={<JobApplicationForm />} />

        {/*  Uncomment only if you have this file */}
        <Route path="/form/Partyinvite" element={<PartyInviteForm />} />
        <Route path="/form/Orderform" element={<OrderForm />} />
        <Route path="/form/Eventfeedback" element={<EventFeedbackForm />} />
        <Route path="/form/T-shirtsignup" element={<TShirtForm />} />

        <Route path="/form/rsvpform" element={<RsvpForm />} />

        <Route path="/form/jobapplication" element={<><BlankForm /><JobApplicationForm /></>} />
        {/* <Route path="/form/partyinvite" element={<PartyInviteForm />} /> */}
        {/* <Route path="/form/rsvpform" element={<RsvpForm />} /> */}


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

        {/* RSVP */}
        <Route
          path="/form/rsvp"
          element={
            <>
              <BlankForm />
              <RsvpForm />
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

        <Route
          path="/partyinvite"
          element={
            <>
              <BlankForm /><PartyInvite />
            </>}
          />

          <Route
          path="/exitticket"
          element={
            <>
              <BlankForm /><ExitTicket />
            </>}
          />
          
          <Route
          path="/feedback"
          element={
            <>
              <BlankForm /><Feedback />
            </>}
          />
          <Route
          path="/assesment"
          element={
            <>
              <BlankForm /><Assesment/>
            </>}
          />
          <Route
          path="/timeoffrequest"
          element={
            <>
              <BlankForm /><TimeOffRequest/>
            </>}
          />
          <Route
          path="/workrequest"
          element={
            <>
              <BlankForm /><WorkRequest/>
            </>}
          />

          <Route
          path="/worksheet"
          element={
            <>
              <BlankForm /><Worksheet/>
            </>}
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

