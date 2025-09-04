import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/admin/pages/Login";
import Dashboard from "./components/admin/pages/Dashboard";

import Wellbeing from "./components/admin/pages/Wellbeing/Wellbeing";
import AddWellbeing from "./components/admin/pages/Wellbeing/AddWellbeing";
import EditWellbeing from "./components/admin/pages/Wellbeing/EditWellbeing";

import MentalHealth from "./components/admin/pages/MentalHealth/MentalHealth";
import AddMentalHealth from "./components/admin/pages/MentalHealth/AddMentalHealth";
import EditMentalHealth from "./components/admin/pages/MentalHealth/EditMentalHealth";

import MeditationInterests from "./components/admin/pages/Meditation-Interests/MeditaionInterests";
import AddMeditaionInterests from "./components/admin/pages/Meditation-Interests/AddMeditaionInterests";
import EditMeditaionInterests from "./components/admin/pages/Meditation-Interests/EditMeditaionInterests";

import Category from "./components/admin/pages/Category/Category";
import AddCategory from "./components/admin/pages/Category/AddCategory";
import EditCategory from "./components/admin/pages/Category/EditCategory";

import DailyPracticesApp from "./components/admin/pages/Daily-Practice/DailyPracticesApp";
import AddDailyPractice from "./components/admin/pages/Daily-Practice/AddDailyPractice";
import EditDailyPractice from "./components/admin/pages/Daily-Practice/EditDailyPractice";

import User from "./components/admin/pages/User/User";

import Forms from "./components/admin/pages/Forms/Forms";
import ViewForm from "./components/admin/pages/Forms/ViewForm";
import EditForm from "./components/admin/pages/Forms/EditForm";

import Slides from "./components/admin/pages/Slides/Slides";
import ViewSlides from "./components/admin/pages/Slides/ViewSlides";

import Response from "./components/admin/pages/Response/Response";
import ViewResponse from "./components/admin/pages/Response/ViewResponse";

import Emotions from "./components/admin/pages/Emotions/Emotions";
import AddEmotions from "./components/admin/pages/Emotions/AddEmotions";
import EditEmotions from "./components/admin/pages/Emotions/EditEmotions";

import Goals from "./components/admin/pages/Goals/Goals";
import AddGoals from "./components/admin/pages/Goals/AddGoals";
import EditGoals from "./components/admin/pages/Goals/EditGoals";

import Singer from "./components/admin/pages/Singer/Singers";
import AddSinger from "./components/admin/pages/Singer/AddSingers";
import EditSinger from "./components/admin/pages/Singer/EditSingers";

import PrivacyTermsEditor from "./components/admin/pages/PrivacyTermsEditor";
import AdminLayout from "./components/admin/components/adminLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/admin" element={<Login />} />

        {/* Admin Layout */}
        <Route path="/admin/dashboard/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* Wellbeing */}
          <Route path="wellbeing" element={<Wellbeing />} />
          <Route path="wellbeing/add" element={<AddWellbeing />} />
          <Route path="wellbeing/edit/:id" element={<EditWellbeing />} />

          {/* Mental Health */}
          <Route path="mental-health" element={<MentalHealth />} />
          <Route path="mental-health/add" element={<AddMentalHealth />} />
          <Route path="mental-health/edit/:id" element={<EditMentalHealth />} />

          {/* Meditation Interests */}
          <Route path="meditation-interests" element={<MeditationInterests />} />
          <Route
            path="meditation-interests/add"
            element={<AddMeditaionInterests />}
          />
          <Route
            path="meditation-interests/edit/:id"
            element={<EditMeditaionInterests />}
          />

          {/* Category */}
          <Route path="category" element={<Category />} />
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/edit/:id" element={<EditCategory />} />

          {/* Daily Practices */}
          <Route path="daily-practices" element={<DailyPracticesApp />} />
          <Route path="daily-practices/add" element={<AddDailyPractice />} />
          <Route
            path="daily-practices/edit/:id"
            element={<EditDailyPractice />}
          />

          {/* Registration/User */}
          <Route path="user" element={<User />} />
          <Route path="registration-info" element={<User />} />

          {/* Forms */}
          <Route path="forms" element={<Forms />} />
          <Route path="forms/view/:id" element={<ViewForm />} />
          <Route path="forms/edit/:id" element={<EditForm />} />

          {/* Slides */}
          <Route path="slides" element={<Slides />} />
          <Route path="slides/view/:formId" element={<ViewSlides />} />

          {/* Responses */}
          <Route path="response" element={<Response />} />
          <Route
            path="form-responses/response/:responseId"
            element={<ViewResponse />}
          />

          {/* Emotions */}
          <Route path="emotions" element={<Emotions />} />
          <Route path="emotions/add" element={<AddEmotions />} />
          <Route path="emotions/edit/:id" element={<EditEmotions />} />

          {/* Goals */}
          <Route path="goals" element={<Goals />} />
          <Route path="goals/add" element={<AddGoals />} />
          <Route path="goals/edit/:id" element={<EditGoals />} />

          {/* Singers */}
          <Route path="singers" element={<Singer />} />
          <Route path="singers/add" element={<AddSinger />} />
          <Route path="singers/edit/:id" element={<EditSinger />} />

          {/* Privacy & Terms */}
          <Route path="privacy-policy" element={<PrivacyTermsEditor />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
