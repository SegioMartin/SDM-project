import React from 'react';
import CourseList from '../../components/courses/CourseList';
import { Link } from 'react-router-dom';

function CoursesPage() {
  return (
    <div>
        <h1>Список курсов</h1>
        <CourseList />
        <Link to="/add-course">
        <button>Добавить курс</button>
        </Link>
    </div>);
}

export default CoursesPage;
