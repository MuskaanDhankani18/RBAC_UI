import React, { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from './apiService';
import "../styles/Role.css";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [showEditRoleForm, setShowEditRoleForm] = useState(false);
  const [newRole, setNewRole] = useState({ name: '' });
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) {
      alert('Please provide a role name');
      return;
    }
  
    const roleToAdd = {
      id: roles.length + 1,
      name: newRole.name,
      permissions: {}, 
    };
  
    const createdRole = await createRole(roleToAdd);
    setRoles([...roles, createdRole]);
    setShowAddRoleForm(false);
    setNewRole({ name: '' });
    setFeedbackMessage('Role added successfully!');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };
  

  const handleEditRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) {
      alert('Please provide a role name');
      return;
    }

    const updatedRole = await updateRole(currentRoleId, newRole);
    setRoles(roles.map((role) => (role.id === currentRoleId ? updatedRole : role)));
    setShowEditRoleForm(false);
    setNewRole({ name: '' });
    setCurrentRoleId(null);
    setFeedbackMessage('Role updated successfully!');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      await deleteRole(id);
      setRoles(roles.filter((role) => role.id !== id));
      setFeedbackMessage('Role deleted successfully!');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleEditFormToggle = (role) => {
    setNewRole({ name: role.name });
    setShowEditRoleForm(true);
    setCurrentRoleId(role.id);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="roles-container">
      <h1>Role Management</h1>
      {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}

      <div className="actions">
        <button className="btn add-role-btn" onClick={() => setShowAddRoleForm(true)}>
          + Add Role
        </button>
        <input
          type="text"
          className="search-bar"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddRoleForm && (
        <form className="role-form" onSubmit={handleAddRole}>
          <input
            type="text"
            name="name"
            placeholder="Enter Role Name"
            value={newRole.name}
            onChange={handleInputChange}
          />
          <button className="btn submit-btn" type="submit">
            Add
          </button>
          <button
            className="btn cancel-btn"
            type="button"
            onClick={() => setShowAddRoleForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {showEditRoleForm && (
        <form className="role-form" onSubmit={handleEditRole}>
          <input
            type="text"
            name="name"
            placeholder="Enter Role Name"
            value={newRole.name}
            onChange={handleInputChange}
          />
          <button className="btn submit-btn" type="submit">
            Save
          </button>
          <button
            className="btn cancel-btn"
            type="button"
            onClick={() => setShowEditRoleForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      <ul className="role-list">
        {filteredRoles.map((role) => (
          <li key={role.id} className="role-item">
            <span>{role.name}</span>
            <div className="role-actions">
              <button
                className="btn edit-btn"
                onClick={() => handleEditFormToggle(role)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn delete-btn"
                onClick={() => handleDeleteRole(role.id)}
              >
                ❌ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleManagement;
