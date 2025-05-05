import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert

const Admin = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        swal("Access Denied", "No token found. Please login.", "error");
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/api/verify-admin',
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token as Bearer
            },
          }
        );

        if (response.status === 200) {
          setIsAdmin(true); // User is an admin, allow rendering of the component
        }
      } catch (error) {
        const message = error.response?.data?.message || "An error occurred.";
        swal("Access Denied", message, "error"); // Show error message in SweetAlert
        navigate('/'); // Redirect to login page if not an admin or error occurs
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  // Show a loading message until verification is complete
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the children component only if the user is an admin
  return isAdmin ? children : null;
};

export default Admin;
