// import React, { useState } from "react";
// import Modal from "./Modal";
// import "../styles/User.css";

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false); // Flag to check if editing
//   const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
//   const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  
//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewUser({ ...newUser, [name]: value });
//   };

//   // Add new user
//   const handleAddUser = () => {
//     if (newUser.name && newUser.email && newUser.role) {
//       setUsers([...users, { ...newUser, id: users.length + 1 }]);
//       setNewUser({ name: "", email: "", role: "" });
//       setIsModalOpen(false);
//     }
//   };

//   // Edit selected user
//   const handleEditUser = async (id, updatedData) => {

//     if (newUser.name && newUser.email && newUser.role) {
//       const updatedUsers = users.map((user) =>
//         user.id === selectedUser.id ? { ...user, ...newUser } : user
//       );
//       setUsers(updatedUsers);
//       setIsModalOpen(false);
//       setIsEditing(false);
//       setSelectedUser(null);
//       setNewUser({ name: "", email: "", role: "" });
//     }
//   };

//   // Delete user
//   const handleDeleteUser = async (id) => {
//     setUsers(users.filter((user) => user.id !== id));
//   };

//   // Open modal for editing user
//   const handleOpenEditModal = (user) => {
//     setIsEditing(true);
//     setSelectedUser(user);
//     setNewUser({ name: user.name, email: user.email, role: user.role });
//     setIsModalOpen(true);
//   };

//   // Open modal for adding new user
//   const handleOpenAddModal = () => {
//     setIsEditing(false);
//     setNewUser({ name: "", email: "", role: "" });
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="user-management">
//       <h1>User Management</h1>
//       <button className="add-btn" onClick={handleOpenAddModal}>Add User</button>

//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 <button
//                   className="action-btn edit-btn"
//                   onClick={() => handleOpenEditModal(user)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="action-btn delete-btn"
//                   onClick={() => handleDeleteUser(user.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal for Add or Edit User */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit User" : "Add User"}>
//         <div className="add-user-form">
//           <label>
//             Name:
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter name"
//               value={newUser.name}
//               onChange={handleInputChange}
//               required
//             />
//           </label>
//           <label>
//             Email:
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email"
//               value={newUser.email}
//               onChange={handleInputChange}
//               required
//             />
//           </label>
//           <label>
//             Role:
//             <select name="role" value={newUser.role} onChange={handleInputChange} required>
//               <option value="">Select Role</option>
//               <option value="Admin">Admin</option>
//               <option value="Editor">Editor</option>
//               <option value="Viewer">Viewer</option>
//             </select>
//           </label>
//           <button
//             className="submit-btn"
//             onClick={isEditing ? handleEditUser : handleAddUser}
//             disabled={!newUser.name || !newUser.email || !newUser.role}
//           >
//             {isEditing ? "Update User" : "Add User"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };



import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getRoles } from './apiService'; // Include updateUser and deleteUser API
import "../styles/User.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false); // For showing Edit form
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [currentUserId, setCurrentUserId] = useState(null); // To track which user is being edited

  // Fetch users and roles
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

  // Handle input change in forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle adding a user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Please fill all fields');
      return;
    }

    const userToAdd = {
      id: users.length + 1,
      ...newUser,
    };

    const createdUser = await createUser(userToAdd);
    setUsers([...users, createdUser]);
    setShowAddUserForm(false);
    setNewUser({ name: '', email: '', role: '' });
  };

  // Handle editing a user
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

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  // Handle form toggling for Edit
  const handleEditFormToggle = (user) => {
    setNewUser({ name: user.name, email: user.email, role: user.role });
    setShowEditUserForm(true);
    setCurrentUserId(user.id);
  };

  return (
    <div className="users-container">
      <h1>USER MANAGEMENT</h1>
      <button onClick={() => setShowAddUserForm(true)}>Add User</button>

      {/* Add User Form */}
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
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowAddUserForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Edit User Form */}
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
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setShowEditUserForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* User List */}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <span>
              {user.name} ({user.email}) - Role: {user.role}
            </span>
            <div>
              <button onClick={() => handleEditFormToggle(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;


