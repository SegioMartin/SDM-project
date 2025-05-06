import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Боковая панель */}
        <Sidebar />
        
        {/* Контент справа от боковой панели */}
        <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/add-group" element={<AddGroupPage />} />
            <Route path="/group/:id" element={<GroupPage />} />

            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/add-course" element={<AddCoursePage />} />
            <Route path="/course/:id" element={<CoursePage />} />

            <Route path="/events" element={<EventsPage />} />
            <Route path="/add-event" element={<AddEventPage />} />
            <Route path="/event/:id" element={<EventPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
