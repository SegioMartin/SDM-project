import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useRole(groupId) {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user && groupId) {
      fetch(`/users/${user.id}/memberships/${groupId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setRole(data?.role?.name || null))
        .catch(() => setRole(null));
    }
  }, [user, groupId]);

  return role;
}
