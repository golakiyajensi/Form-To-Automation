import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/admin/pages/Login";
import Dashboard from "./components/admin/pages/Dashboard";
import User from "./components/admin/pages/User/User";
import Forms from "./components/admin/pages/Forms/Forms";
import Slides from "./components/admin/pages/Slides/Slides";
import Response from "./components/admin/pages/Response/Response";
import AdminLayout from "./components/admin/components/adminLayout";
import ViewSlides from "./components/admin/pages/Slides/ViewSlides";
import ViewResponse from "./components/admin/pages/Response/ViewResponse";
import ViewForm from "./components/admin/pages/Forms/ViewForm";
import EditForm from "./components/admin/pages/Forms/EditForm";
import ViewFormResponse from "./components/admin/pages/Forms/ViewFormResponse";
import EditSlide from "./components/admin/pages/Slides/EditSlide.JSX";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Login />} />

        <Route path="/admin/dashboard/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="forms" element={<Forms />} />
          <Route path="forms/view/:id" element={<ViewForm />} />
          <Route path="forms/edit/:id" element={<EditForm />} />
          <Route path="form-responses/:formId" element={<ViewFormResponse />} />
          <Route path="slides" element={<Slides />} />
          <Route path="slides/view/:formId" element={<ViewSlides />} />
          <Route path="slides/edit/:slideId/:formId" element={<EditSlide />} />
          <Route path="response" element={<Response />} />
          <Route
            path="form-responses/response/:responseId"
            element={<ViewResponse />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
