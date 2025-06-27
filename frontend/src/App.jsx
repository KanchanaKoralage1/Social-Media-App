import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Homepage from "./components/home/Homepage";
import Sidebar from "./components/navigation/Sidebar";
import Notification from "./components/navigation/Notification";
import Profile from "./components/navigation/Profile";
import Saved from "./components/navigation/Saved";
import Message from "./components/navigation/Message";
import Explore from "./components/navigation/Explore";
import Home from "./components/navigation/Home";
import RightSide from "./components/rightSide/RightSide";
import ProfilePage from "./components/middle/ProfilePage";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/rightside" element={<RightSide />} /> */}

        <Route element={<Layout />}>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/messages" element={<Message />} /> 
        <Route path="/explore" element={<Explore />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/notifications" element={<Notification />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/saved" element={<Saved />} /> 

         </Route>

         
      </Routes>
    </Router>
  );
}

export default App;