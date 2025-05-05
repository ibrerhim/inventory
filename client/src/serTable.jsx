import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import './UserTable.css'; // Assuming you want custom styling.
import LogoutButton from './LogoutButton';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
    });

    const [searchText, setSearchText] = useState(''); // For search input
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/verify-token', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true); // Set authentication state
                    await fetchUsers(); // Token is valid, fetch users
                } else {
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            }
        };

        validateToken();
    }, [navigate]);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the Authorization header
            }
        };

        try {
            const response = await axios.get('http://localhost:5000/api/users', config);
            setUsers(response.data);
            setFilteredUsers(response.data); // Initialize filteredUsers with fetched data
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        if (e.target.value === '') {
            setFilteredUsers(users); // Reset if search is cleared
        } else {
            const filtered = users.filter((user) =>
                user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.email.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const deleteUser = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the Authorization header
            }
        };

        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, config);
            fetchUsers(); // Re-fetch the user list after deletion
            setSuccessMessage('User deleted successfully');
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const updateUser = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to the Authorization header
            }
        };

        try {
            await axios.put(`http://localhost:5000/api/users/${id}`, formData, config);
            fetchUsers(); // Re-fetch the user list after update
            setEditingUser(null); // Exit editing mode
            setFormData({ name: '', email: '', age: '' });
            setSuccessMessage('User updated successfully');
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const startEditing = (user) => {
        setEditingUser(user._id);
        setFormData({ name: user.name, email: user.email, age: user.age });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    // Define columns for the DataTable
    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Age',
            selector: row => row.age,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                editingUser === row._id ? (
                    <>
                        <button className="t" onClick={() => updateUser(row._id)}>
                            Save
                        </button>
                        <button className="t" onClick={() => setEditingUser(null)}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button className="t" onClick={() => startEditing(row)}>
                            Edit
                        </button>
                        <button className="t" onClick={() => deleteUser(row._id)}>
                            Delete
                        </button>
                    </>
                )
            ),
        }
    ];

    const customStyles = {
      
        table: {
            style: {
                fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
                margin: '20px auto',
                padding: '20px',
                borderRadius: '15px',
                textAlign: 'center',
                backgroundColor: "black",
                color: 'azure',
                border: '1px solid #003482',
            },
        },
        pagination:{
            style:
            {
              backgroundColor:"transparent",
              color:"white"
        },
    },
        headRow: {
            style:{
                fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
                margin: '20px auto',
                padding: '5px',
                
                textAlign: 'center',
                backgroundColor: '#00022d',
                color: 'azure',
                border: '1px solid #003482',
            },
        },
        rows: {
            style: {
                margin: ' auto',
                padding: '20px',
                borderRadius: '15px',
                textAlign: 'center',
                backgroundColor: '#000000',
                color: 'azure',
                border: '1px solid #0056b3',
            },
        },
    };

    if (!isAuthenticated) {
        return null; // Optionally, you could display a loading message here.
    }

    return (
        <div>
            <Link to="/">
                <button className="shiny-cta">Home</button>
            </Link>
            <Link to="/form">
                <button className="shiny-cta"><span>ADD +</span></button>
            </Link>
            <LogoutButton />

            {/* Search input */}
            <input
                type="text"
                placeholder="Search by name or email"
                value={searchText}
                onChange={handleSearch}
                className="search-input"
            />

            <DataTable
                title="Users"
                columns={columns}
                data={filteredUsers} // Use filteredUsers for table data
                pagination
                highlightOnHover
                persistTableHead // Keeps the header visible during search or pagination
                customStyles={customStyles} // Applying custom styles
            />

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

export default UserTable;
