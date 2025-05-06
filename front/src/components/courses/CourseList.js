import React, { useEffect, useState } from 'react';
import { getCourses } from '../../api/courses';
import { Link } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error('Ошибка при загрузке курсов:', err);
        setError('Не удалось загрузить курсы');
      });
  }, []);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/course/${course.id}`}>
                <strong>{course.name}</strong> — {course.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
