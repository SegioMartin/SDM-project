import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import GroupsPage from './pages/groups/GroupsPage';
import AddGroupPage from './pages/groups/AddGroupPage';
import GroupPage from './pages/groups/GroupPage';

import CoursesPage from './pages/courses/CoursesPage';
import AddCoursePage from './pages/courses/AddCoursePage';
import CoursePage from './pages/courses/CoursePage';

import EventsPage from './pages/events/EventsPage';
import AddEventPage from './pages/events/AddEventPage';
import EventPage from './pages/events/EventPage';

import Sidebar from './components/Sidebar';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Routes>
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/add-group" element={<AddGroupPage />} />
          <Route path="/group/:id" element={<GroupPage />} />

          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/add-course/:groupId" element={<AddCoursePage />} />
          <Route path="/course/:id" element={<CoursePage />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/add-event" element={<AddEventPage />} />
          <Route path="/event/:id" element={<EventPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
