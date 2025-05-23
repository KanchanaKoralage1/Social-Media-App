// import { Route, Routes } from "react-router-dom"
// import HomePage from "./components/home/HomePage"
// import Authentication from "./components/authentication/Authentication"

// function App() {
  

//   return (
//     <>
//       <Routes>

//         <Route path="/*" element={true?<HomePage/>:<Authentication/>}/>

//       </Routes>
//     </>
//   )
// }

// export default App

// filepath: d:\Social Media App\frontend\src\App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import LoginPage from './components/authentication/LoginPage';
import SignupPage from './components/authentication/SignupPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;