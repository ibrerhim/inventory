import { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Edit, Trash, Plus, Search, UserPlus, UserCog } from 'lucide-react';
import SlideNavbar from './SlideInNavbar';
import { DataTable } from './components/ui/data-table';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from './components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select';
import { Label } from './components/ui/label';

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
            key: "username",
            header: "Username",
            cell: (row) => <div className="font-medium">{row.username}</div>,
        },
        {
            key: "email",
            header: "Email",
            cell: (row) => <div>{row.email || "—"}</div>,
        },
        {
            key: "role",
            header: "Role",
            cell: (row) => (
                <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                    row.role === 'admin'
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                        : 'bg-green-500/20 text-green-500 border border-green-500/30'
                }`}>
                    {row.role}
                </div>
            ),
        },
        {
            key: "dateCreated",
            header: "Date Created",
            cell: (row) => <div>{new Date(row.dateCreated).toLocaleDateString()}</div>,
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(row)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100/20"
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(row._id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100/20"
                    >
                        <Trash size={16} />
                    </Button>
                </div>
            ),
        },
    ];

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
        <div className="flex h-screen bg-background">
            <SlideNavbar />
            <main className="flex-1 overflow-auto transition-all duration-300 ml-20 lg:ml-64 p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Users</h1>
                        <Button
                            onClick={() => {
                                setModalIsOpen(true);
                                setIsEdit(false);
                                setNewUser({ username: '', email: '', password: '', role: 'user' });
                            }}
                            className="flex items-center gap-2"
                        >
                            <UserPlus size={16} /> Add New User
                        </Button>
                    </div>

                    <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
                        <CardContent className="p-0">
                            <DataTable
                                columns={columns}
                                data={filteredUsers}
                                title="User Management"
                                searchPlaceholder="Search by username..."
                                searchField="username"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Dialog for adding/updating user */}
                <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {isEdit ? (
                                    <div className="flex items-center gap-2">
                                        <UserCog size={18} />
                                        Edit User
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus size={18} />
                                        Add New User
                                    </div>
                                )}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleAddUser} className="space-y-4 py-4">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        value={newUser.username}
                                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Password {isEdit && <span className="text-xs text-muted-foreground">(leave empty to keep current)</span>}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        required={!isEdit}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setModalIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {isEdit ? "Update User" : "Add User"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default Users;

