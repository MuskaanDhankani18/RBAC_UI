// import React, { useState } from "react";
// import Modal from "./Modal";
// import "../styles/Role.css";

// const RoleManagement = () => {
//   const [roles, setRoles] = useState([
//     { id: 1, name: "Admin", permissions: ["Manage Users", "View Reports"] },
//     { id: 2, name: "Viewer", permissions: ["View Reports"] },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
//   const [newRole, setNewRole] = useState({ id: null, name: "", permissions: "" });
//   const [editingRoleId, setEditingRoleId] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRole({ ...newRole, [name]: value });
//   };

//   const handleAddRole = () => {
//     if (newRole.name) {
//       setRoles([
//         ...roles,
//         { ...newRole, id: roles.length + 1, permissions: newRole.permissions.split(",").map((p) => p.trim()) },
//       ]);
//       resetModal();
//     }
//   };

//   const handleEditRole = () => {
//     if (newRole.name) {
//       setRoles(
//         roles.map((role) =>
//           role.id === editingRoleId
//             ? { ...role, ...newRole, permissions: newRole.permissions.split(",").map((p) => p.trim()) }
//             : role
//         )
//       );
//       resetModal();
//     }
//   };

//   const handleDeleteRole = (id) => {
//     setRoles(roles.filter((role) => role.id !== id));
//   };

//   const openEditModal = (role) => {
//     setModalMode("edit");
//     setEditingRoleId(role.id);
//     setNewRole({
//       name: role.name,
//       permissions: Array.isArray(role.permissions) ? role.permissions.join(", ") : role.permissions || "",
//     });
//     setIsModalOpen(true);
//   };

//   const resetModal = () => {
//     setNewRole({ id: null, name: "", permissions: "" });
//     setIsModalOpen(false);
//     setModalMode("add");
//     setEditingRoleId(null);
//   };

//   return (
//     <div className="role-management">
//       <h1>Role Management</h1>
//       <button className="add-btn" onClick={() => setIsModalOpen(true)}>
//         Add Role
//       </button>

//       <table className="role-table">
//         <thead>
//           <tr>
//             <th>Role Name</th>
//             <th>Permissions</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {roles.map((role) => (
//             <tr key={role.id}>
//               <td>{role.name}</td>
//               <td>{Array.isArray(role.permissions) ? role.permissions.join(", ") : role.permissions}</td>
//               <td>
//                 <button className="action-btn edit-btn" onClick={() => openEditModal(role)}>
//                   Edit
//                 </button>
//                 <button className="action-btn delete-btn" onClick={() => handleDeleteRole(role.id)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal for Add/Edit Roles */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={resetModal}
//         title={modalMode === "add" ? "Add Role" : "Edit Role"}
//       >
//         <div className="add-role-form">
//           <label>
//             Role Name:
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter role name"
//               value={newRole.name}
//               onChange={handleInputChange}
//               required
//             />
//           </label>
//           <label>
//             Permissions:
//             <input
//               type="text"
//               name="permissions"
//               placeholder="Enter permissions (comma separated)"
//               value={newRole.permissions}
//               onChange={handleInputChange}
//             />
//           </label>
//           <button
//             className="submit-btn"
//             onClick={modalMode === "add" ? handleAddRole : handleEditRole}
//             disabled={!newRole.name}
//           >
//             {modalMode === "add" ? "Add Role" : "Save Changes"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default RoleManagement;


import React, { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from './apiService'; // Include necessary API functions
import "../styles/Role.css";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [showEditRoleForm, setShowEditRoleForm] = useState(false); // For showing Edit form
  const [newRole, setNewRole] = useState({ name: '' });
  const [currentRoleId, setCurrentRoleId] = useState(null); // To track which role is being edited

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    };

    fetchRoles();
  }, []);

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  // Handle adding a role
  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) {
      alert('Please provide a role name');
      return;
    }

    const roleToAdd = {
      id: roles.length + 1,
      ...newRole,
    };

    const createdRole = await createRole(roleToAdd);
    setRoles([...roles, createdRole]);
    setShowAddRoleForm(false);
    setNewRole({ name: '' });
  };

  // Handle editing a role
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
  };

  // Handle deleting a role
  const handleDeleteRole = async (id) => {
    await deleteRole(id);
    setRoles(roles.filter((role) => role.id !== id));
  };

  // Handle form toggling for Edit
  const handleEditFormToggle = (role) => {
    setNewRole({ name: role.name });
    setShowEditRoleForm(true);
    setCurrentRoleId(role.id);
  };

  return (
    <div className="roles-container">
      <h1>ROLE MANAGEMENT</h1>
      <button onClick={() => setShowAddRoleForm(true)}>Add Role</button>

      {/* Add Role Form */}
      {showAddRoleForm && (
        <form className="add-role-form" onSubmit={handleAddRole}>
          <input
            type="text"
            name="name"
            placeholder="Role Name"
            value={newRole.name}
            onChange={handleInputChange}
          />
          <button type="submit">Add Role</button>
          <button type="button" onClick={() => setShowAddRoleForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Edit Role Form */}
      {showEditRoleForm && (
        <form className="add-role-form" onSubmit={handleEditRole}>
          <input
            type="text"
            name="name"
            placeholder="Role Name"
            value={newRole.name}
            onChange={handleInputChange}
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setShowEditRoleForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Role List */}
      <ul className="role-list">
        {roles.map((role) => (
          <li key={role.id}>
            <span>{role.name}</span>
            <div>
              <button onClick={() => handleEditFormToggle(role)}>Edit</button>
              <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleManagement;

