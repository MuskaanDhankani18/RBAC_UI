import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getRoles } from './apiService'; 
import { useAuth } from '../AuthContext';
import "../styles/User.css";
import { useLocation } from "react-router-dom";


const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false); 
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const location = useLocation();
  const username = location.state?.username;  

  
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    const fetchRoles = async () => {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    };

    fetchUsers();
    fetchRoles();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };


  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill all fields');
      return;
    }

    const userToAdd = { id: users.length + 1, ...newUser };
    const createdUser = await createUser(userToAdd);
    setUsers([...users, createdUser]);
    setShowAddUserForm(false);
    setNewUser({ name: '', email: '', role: '' });
  };


  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill all fields');
      return;
    }

    const updatedUser = await updateUser(currentUserId, newUser);
    setUsers(users.map((user) => (user.id === currentUserId ? updatedUser : user)));
    setShowEditUserForm(false);
    setNewUser({ name: '', email: '', role: '' });
    setCurrentUserId(null);
  };


  const handleDeleteUser = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    }
  };


  const handleEditFormToggle = (user) => {
    setNewUser({ name: user.name, email: user.email, role: user.role });
    setShowEditUserForm(true);
    setCurrentUserId(user.id);
  };


  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-container">
      <h1>Welcome, {user?.name || "Guest"}!</h1>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by name, email or role..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <button onClick={() => setShowAddUserForm(true)}>Add User</button>

  
      {showAddUserForm && (
        <form className="add-user-form" onSubmit={handleAddUser}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowAddUserForm(false)}>Cancel</button>
        </form>
      )}


      {showEditUserForm && (
        <form className="add-user-form" onSubmit={handleEditUser}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setShowEditUserForm(false)}>Cancel</button>
        </form>
      )}


      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user.id}>
            <span>{user.name} ({user.email}) - Role: {user.role}</span>
            <div>
              <button onClick={() => handleEditFormToggle(user)}>Edit</button>
              <button className='delete' onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
