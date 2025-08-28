import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Template from "./components/Template";
import FormPage from "./components/FormPage";
import Gallery from "./components/Gallery";
import MainBody from "./components/MainBody";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Template />
              <MainBody />
            </>
          }
        />

        {/* Gallery Page */}
        <Route path="/gallery" element={<Gallery />} />

        {/* Dynamic Form Page */}
        <Route path="/form/:id" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
