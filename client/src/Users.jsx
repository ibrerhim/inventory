import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './User.css';
import SlideNavbar from './SlideInNavbar';
import Modal from 'react-modal';
import swal from 'sweetalert';
import { Edit, Trash } from 'lucide-react'; // Import Lucide React icons
import "./UserTable.css";

const Users = () => {
    const [usersData, setUsersData] = useState([]); 
    const [filterText, setFilterText] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
    const [isEdit, setIsEdit] = useState(false); // To track edit mode
    const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited

    // Fetch user data from the backend
    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                setUsersData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUsersData();
    }, []);

    // Filter user data based on username
    const filteredUsers = usersData.filter(user =>
        user.username.toLowerCase().includes(filterText.toLowerCase())
    );

    // Define the columns for the DataTable
    const columns = [
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true,
        },
        {
            name: 'Date Created',
            selector: row => new Date(row.dateCreated).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openEditModal(row)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Edit color="blue" size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(row._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash color="red" size={18} />
                    </button>
                </div>
            ),
        },
    ];

    const customStyles = {
        table: {
            style: {
                fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                margin: "20px auto",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                backgroundColor: "#00223a",
                color: "blue",
                border: "1px solid #003482",
                width: "1000px",
                justifyContent: "center",
            },
        },
        pagination: {
            style: {
              backgroundColor: "transparent",
              color: "white",
            },
          },
        headRow: {
            style: {
                borderRadius: "10px",
                backgroundColor: "#001021",
                color: "azure",
                borderLeft: "1px solid #0056b3",
                borderRight: "1px solid #0056b3",
                textAlign: "center",
            },
        },
        rows: {
            style: {
                padding: "5px",
                borderRadius: "10px",
                backgroundColor: "#001021",
                color: "azure",
                border: "1px solid #0056b3",
                transition: "background-color 0.3s ease",
                '&:hover': {
                    backgroundColor: "#004367",
                },
            },
        },
        headCells: {
            style: {
                justifyContent: "center",
                textAlign: "center",
            },
        },
        cells: {
            style: {
                margin: "auto",
                padding: "10px",
                justifyContent: "center",
                color: "azure",
                borderRight: "1px solid #0056b3",
            },
        },
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (isEdit) {
            try {
                const response = await axios.put(`http://localhost:3000/api/users/${editingUserId}`, newUser);
                const updatedUser = response.data.user;
                setUsersData(usersData.map(user => (user._id === editingUserId ? updatedUser : user)));
                swal("Success!", "User updated successfully!", "success");
            } catch (error) {
                const errorMessage = error.response?.data?.message || "An error occurred while updating the user.";
                swal("Error", errorMessage, "error");
            }
        } else {
            try {
                const response = await axios.post('http://localhost:3000/api/users', newUser);
                const addedUser = response.data.user;
                setUsersData([...usersData, addedUser]);
                swal("Success!", response.data.message || "User added successfully!", "success");
            } catch (error) {
                const errorMessage = error.response?.data?.message || "An error occurred while adding the user.";
                swal("Error", errorMessage, "error");
            }
        }
        setModalIsOpen(false);
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        setIsEdit(false);
        setEditingUserId(null);
    };

    const openEditModal = (user) => {
        setNewUser({ username: user.username, email: user.email, password: '', role: user.role });
        setIsEdit(true);
        setEditingUserId(user._id);
        setModalIsOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${userId}`);
            setUsersData(usersData.filter(user => user._id !== userId));
            swal("Deleted!", "User has been deleted.", "success");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while deleting the user.";
            swal("Error", errorMessage, "error");
        }
    };

    return (
        <div>
            <SlideNavbar />
            <div className='content'>
                <h2 id='ik'>Users Data</h2>

                <button className='b' onClick={() => { setModalIsOpen(true); setIsEdit(false); setNewUser({ username: '', email: '', password: '', role: 'user' }); }} style={{ padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #0056b3" }}>
                    + Add New User
                </button>

                <input
                    type="text"
                    placeholder="Search by Username"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    style={{
                        padding: "10px",
                        marginBottom: "15px",
                        width: "200px",
                        borderRadius: "5px",
                        border: "1px solid #0056b3",
                        marginRight: "10px"
                    }}
                />

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    pagination
                   
                    customStyles={customStyles}
                />

                <Modal
                    className="form-container"
                    overlayClassName="modal-overlay"
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="User Form"
                >
                    <h2>{isEdit ? "Edit User" : "Add New User"}</h2>
                    <form onSubmit={handleAddUser} className="user-form">
                        <div className="form-group">
                            <label>
                                Username:
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                    required
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    required={!isEdit} // Only require password when adding a new user
                                />
                            </label>
                            <label>
                                Role:
                                <select
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </label>
                            <button type="submit">
                                {isEdit ? "Update User" : "Add User"}
                            </button>
                        </div>
                    </form>
                    <button onClick={() => setModalIsOpen(false)}>Close</button>
                </Modal>
            </div>
        </div>
    );
};

export default Users;

