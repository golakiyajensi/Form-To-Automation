import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import "./CSS/Index1.css";

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

import RsvpForm from "./components/RsvpForm.jsx";
import Quiz from "./components/Quiz.jsx";
import PartyInviteForm from "./components/PartyInvite.jsx";
import OrderForm from "./components/Orderform.jsx";
import EventFeedbackForm from "./components/Eventfeedback.jsx";
import TShirtForm from "./components/TShirtForm.jsx";
import EventRegistration from "./components/EventRegistration.jsx";
import CourseEvaluation from "./components/CourseEvaluation.jsx";
import Findtime from "./components/Findtime.jsx";
import ExitTicket from "./components/ExitTicket.jsx";
import Feedback from "./components/Feedback.jsx";
import Assesment from "./components/Assesment.jsx";
import TimeOffRequest from "./components/TimeOffRequest.jsx";
import WorkRequest from "./components/WorkRequest.jsx";
import Worksheet from "./components/Worksheet.jsx";

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
    "/assesment",
    "/timeoffrequest",
    "/workrequest",
    "/form/jobapplication",
  ];

  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Default/Home */}
        <Route path="/" element={<Slidetemplate />} />
        <Route path="/forms" element={<Form />} />
        <Route path="/form/:id" element={<FormPage />} />

        {/* Form Variants */}
        <Route
          path="/form/jobapplication"
          element={
            <>
              <BlankForm />
              <JobApplicationForm />
            </>
          }
        />
        <Route
          path="/form/orderform"
          element={
            <>
              <BlankForm />
              <OrderForm />
            </>
          }
        />
        <Route
          path="/form/tshirtform"
          element={
            <>
              <BlankForm />
              <TShirtForm />
            </>
          }
        />
        <Route
          path="/form/eventfeedbackform"
          element={
            <>
              <BlankForm />
              <EventFeedbackForm />
            </>
          }
        />
        <Route
          path="/form/rsvp"
          element={
            <>
              <BlankForm />
              <RsvpForm />
            </>
          }
        />
        <Route
          path="/form/partyinvite"
          element={
            <>
              <BlankForm />
              <PartyInviteForm />
            </>
          }
        />
        <Route
          path="/form/eventregistration"
          element={
            <>
              <BlankForm />
              <EventRegistration />
            </>
          }
        />
        <Route
          path="/form/evaluation"
          element={
            <>
              <BlankForm />
              <CourseEvaluation />
            </>
          }
        />
        <Route
          path="/form/findtime"
          element={
            <>
              <BlankForm />
              <Findtime />
            </>
          }
        />

        {/* Docs & Sheets */}
        <Route path="/docs" element={<Docs />} />
        <Route path="/docstemplate" element={<Docstemplate />} />
        <Route path="/docsgallery" element={<Docsgallery />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path="/sheetgallery" element={<SheetGallery />} />

        {/* Slides */}
        <Route path="/slidetemplate" element={<Slidetemplate />} />
        <Route path="/slidegallery" element={<SlideGallery />} />

        {/* Auth */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/useaccount" element={<UseAccount />} />
        <Route path="/password" element={<Password />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Galleries */}
        <Route path="/templategallery" element={<TemplateGallery />} />
        <Route path="/formgallery" element={<Template />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* Form Sections */}
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

        {/* Extra Forms */}
        <Route
          path="/exitticket"
          element={
            <>
              <BlankForm />
              <ExitTicket />
            </>
          }
        />
        <Route
          path="/feedback"
          element={
            <>
              <BlankForm />
              <Feedback />
            </>
          }
        />
        <Route
          path="/assesment"
          element={
            <>
              <BlankForm />
              <Assesment />
            </>
          }
        />
        <Route
          path="/timeoffrequest"
          element={
            <>
              <BlankForm />
              <TimeOffRequest />
            </>
          }
        />
        <Route
          path="/workrequest"
          element={
            <>
              <BlankForm />
              <WorkRequest />
            </>
          }
        />
        <Route
          path="/worksheet"
          element={
            <>
              <BlankForm />
              <Worksheet />
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
