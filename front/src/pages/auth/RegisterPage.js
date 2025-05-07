import React, { useState } from 'react';
import { createUser } from '../../api/users';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    patronomic: '',
    email: '',
    password: '',
    avatar: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="surname"
          placeholder="Фамилия"
          value={formData.surname}
          onChange={handleChange}
        />
        <input
          type="text"
          name="patronomic"
          placeholder="Отчество"
          value={formData.patronomic}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="avatar"
          placeholder="Ссылка на аватар"
          value={formData.avatar}
          onChange={handleChange}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterPage;
