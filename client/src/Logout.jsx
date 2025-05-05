import React from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert'; // Import SweetAlert

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');

    // Display a SweetAlert message
    swal("Logout Successful", "You have been logged out.", "success").then(() => {
      // Navigate to the login page after the alert is confirmed
      navigate('/login');
    });
  };

  return (
    <div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

// Optional: Add some styles for the button
const styles = {
  logoutButton: {
    padding: '10px 14px',
    backgroundColor: '#f44336', // Red background
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: "background-color 0.3s ease",
                '&:hover': {
                    backgroundColor: "#004367",
                },

  },
};

export default Logout;
