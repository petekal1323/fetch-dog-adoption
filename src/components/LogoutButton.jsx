// src/components/LogoutButton.jsx

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://frontend-take-home-service.fetch.com/auth/logout',
        {},
        { withCredentials: true }
      );
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Button 
      className="logout-button"
      variant="outlined" 
      color="secondary" 
      onClick={handleLogout} 
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
      }}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
