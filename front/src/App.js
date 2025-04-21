import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';



function App() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('Address:')
      console.log('http://server:8080/api/courses');
      try {
        const response = await fetch('http://172.18.0.4:8080/api/courses');
        // const response = await fetch('http://server:8080/api/courses');
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setCourseData(data);
        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn meow
        </a>
        {loading && <p>Загрузка данных...</p>}
        {error && <p>Ошибка: {error.message}</p>}
        {courseData && (
          <pre style={{ textAlign: 'left' }}>
            {courseData}
          </pre>
        )}
      </header>
    </div>
  );
}

export default App;