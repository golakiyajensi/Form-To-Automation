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
import AddDailyPractice from "./components/admin/pages/Daily-Practice/AddDailyPractice ";
import EditDailyPractice from "./components/admin/pages/Daily-Practice/EditDailyPractice ";

import User from "./components/admin/pages/User/User";

import Forms from "./components/admin/pages/Forms/Forms";

import Slides from "./components/admin/pages/Slides/Slides";

import Response from "./components/admin/pages/Response/Response";

import Emotions from "./components/admin/pages/Emotions/Emotions";
import AddEmotions from "./components/admin/pages/Emotions/AddEmotions";
import EditEmotions from "./components/admin/pages/Emotions/EditEmotions";

import Goals from "./components/admin/pages/Goals/Goals";
import AddGoals from "./components/admin/pages/Goals/AddGoals";
import EditGoals from "./components/admin/pages/Goals/EditGoals";

import Singer from "./components/admin/pages/Singer/Singers";
import AddSinger from "./components/admin/pages/Singer/AddSingers";
import EditSinger from "./components/admin/pages/Singer/EditSingers";

// import Category from "./components/admin/pages/Category";
import AdminLayout from "./components/admin/components/adminLayout";
import PrivacyTermsEditor from "./components/admin/pages/PrivacyTermsEditor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Login />} />

        <Route path="/admin/dashboard/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="wellbeing" element={<Wellbeing />} />
          <Route path="wellbeing/add" element={<AddWellbeing />} />
          <Route path="wellbeing/edit/:id" element={<EditWellbeing />} />

          <Route path="user" element={<User />} />

          <Route path="forms" element={<Forms />} />

          <Route path="slides" element={<Slides />} />
          <Route path="response" element={<Response />} />

          <Route path="mental-health" element={<MentalHealth />} />
          <Route path="mental-health/add" element={<AddMentalHealth />} />
          <Route path="mental-health/edit/:id" element={<EditMentalHealth />} />

          <Route
            path="meditation-interests"
            element={<MeditationInterests />}
          />
          <Route
            path="meditation-interests/add"
            element={<AddMeditaionInterests />}
          />
          <Route
            path="meditation-interests/edit/:id"
            element={<EditMeditaionInterests />}
          />

          <Route path="category" element={<Category />} />
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/edit/:id" element={<EditCategory />} />

          <Route path="daily-practices" element={<DailyPracticesApp />} />
          <Route path="daily-practices/add" element={<AddDailyPractice />} />
          <Route
            path="daily-practices/edit/:id"
            element={<EditDailyPractice />}
          />

          <Route path="registration-info" element={<User />} />

          <Route path="emotions" element={<Emotions />} />
          <Route path="emotions/add" element={<AddEmotions />} />
          <Route path="emotions/edit/:id" element={<EditEmotions />} />

          <Route path="goals" element={<Goals />} />
          <Route path="goals/add" element={<AddGoals />} />
          <Route path="goals/edit/:id" element={<EditGoals />} />

          <Route path="singers" element={<Singer />} />
          <Route path="singers/add" element={<AddSinger />} />
          <Route path="singers/edit/:id" element={<EditSinger />} />

          {/* Privacy and Terms Editor */}
          <Route path="privacy-policy" element={<PrivacyTermsEditor />} />
          {/* Add other routes as needed */}
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
