import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert

const Auth = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn("No token found in local storage.");
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/api/verify-token',
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure correct format
            },
          }
        );

        if (response.status === 200) {
          setIsVerified(true);
        } else {
          console.warn("Verification failed, navigating to login.");
          navigate('/login');
        }
      } catch (error) {
        // Extract the actual response message for SweetAlert
        const errorMessage = error.response?.data?.message || "An error occurred during token verification.";
        
        // Display SweetAlert on token verification failure
        swal("Token Verification Failed", errorMessage, "error");
        console.error('Token verification failed:', errorMessage);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  // Show a loading message until verification is complete
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the children component only if the token is verified
  return isVerified ? children : null;
};

export default Auth;
