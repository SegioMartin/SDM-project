import React from 'react';
import EventList from '../../components/events/EventList';
import { Link } from 'react-router-dom';

function EventsPage() {
  return (
    <div>
      <h1>Список событий</h1>
      <EventList />
      <Link to="/add-event">
        <button>Добавить событие</button>
      </Link>
    </div>
  );
}

export default EventsPage;
