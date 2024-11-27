import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    // Simulate a logout action by clearing any authentication data
    // For example, clearing localStorage (if using it for auth)
    localStorage.removeItem('authToken'); // Assuming you're using localStorage for authentication

    // Redirect to the dashboard page
    history.push('/');
  }, [history]);

  return <div>Logging out...</div>;
};

export default Logout;
