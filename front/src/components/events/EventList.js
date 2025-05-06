import React, { useEffect, useState } from 'react';
import { getEvents } from '../../api/events';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvents()
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error('Ошибка при загрузке событий:', err);
        setError('Не удалось загрузить события');
      });
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link to={`/event/${event.id}`}>
              <strong>{event.name}</strong> — {event.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;
