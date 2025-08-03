import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Homepage from "./components/home/Homepage";
import Notification from "./components/navigation/Notification";
import Profile from "./components/navigation/Profile";
import Saved from "./components/navigation/Saved";
import Message from "./components/navigation/Message";
import Explore from "./components/navigation/Explore";
import Home from "./components/navigation/Home";
import ProfilePage from "./components/middle/ProfilePage";
import Layout from "./components/layout/Layout";
import PostShare from "./components/middle/PostShare";
import PostPage from "./components/middle/PostPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/home" element={<Home />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/share/:postId" element={<PostShare />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
