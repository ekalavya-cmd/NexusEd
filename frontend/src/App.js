import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import StudyGroups from "./components/StudyGroups";
import GroupDetail from "./components/GroupDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import CalendarPage from "./components/CalendarPage";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
