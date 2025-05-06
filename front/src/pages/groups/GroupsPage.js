// pages/GroupsPage.js
import React from 'react';
import GroupList from '../../components/groups/GroupList';
import { Link } from 'react-router-dom';

function GroupsPage() {
  return (
    <div>
      <h1>Список групп</h1>
      <GroupList />
      <Link to="/add-group">
        <button>Добавить группу</button>
      </Link>
    </div>
  );
}

export default GroupsPage;
