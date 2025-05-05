
import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        // Set up headers for the request
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the Authorization header
            }
        };

        axios.post('http://localhost:5000/api/users', formData, config)
            .then((response) => {
                setSuccessMessage(response.data.message || 'User created successfully');
                setShowSuccessModal(true);
                setFormData({
                    name: '',
                    email: '',
                    age: ''
                });
            })
            .catch((error) => {
                setErrorMessage(error.response?.data?.message || 'There was an error!');
                setShowErrorModal(true);
            });
    };

    // Close modals
    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/table'); // Navigate after closing the success modal
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="form-container">
            <Link to="/table">
                <button className="shiny-cta"><span> BACK </span></button>
            </Link>
            <h2>Add record</h2>
            <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="shiny-cta">Submit</button>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{successMessage}</h2>
                        <button onClick={closeSuccessModal} className="close-modal">Close</button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{errorMessage}</h2>

                        <button onClick={closeErrorModal} className="close-modal">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserForm;
