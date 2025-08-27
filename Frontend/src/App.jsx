import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // required for dropdown behavior
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./CSS/style.css";

import Signin from "./Components/Signin.jsx";
import UseAccount from "./Components/UseAccount.jsx";
import Password from "./Components/Pasword.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/useaccount' element={<UseAccount/>}></Route>
          <Route path='/password' element={<Password/>}></Route>
          <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App;
