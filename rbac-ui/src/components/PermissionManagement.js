// import React, { useState } from "react";
// import "../styles/Permission.css";

// const PermissionsManagement = () => {
//   const [roles, setRoles] = useState([
//     { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
//     { id: 2, name: "Viewer", permissions: ["Read"] },
//   ]);

//   const [selectedRole, setSelectedRole] = useState(null);
//   const [newPermission, setNewPermission] = useState("");

//   const handleRoleSelect = (role) => {
//     setSelectedRole(role);
//   };

//   const handleAddPermission = () => {
//     if (newPermission && selectedRole) {
//       const updatedRoles = roles.map((role) =>
//         role.id === selectedRole.id
//           ? { ...role, permissions: [...role.permissions, newPermission] }
//           : role
//       );
//       setRoles(updatedRoles);
//       setNewPermission("");
//     }
//   };

//   const handleRemovePermission = (permission) => {
//     if (selectedRole) {
//       const updatedRoles = roles.map((role) =>
//         role.id === selectedRole.id
//           ? {
//               ...role,
//               permissions: role.permissions.filter((perm) => perm !== permission),
//             }
//           : role
//       );
//       setRoles(updatedRoles);
//     }
//   };

//   return (
//     <div className="permissions-management">
//       <h1 className="title">Manage Permissions</h1>

//       <div className="management-container">
//         {/* Role Selection */}
//         <div className="role-list">
//           <h2>Roles</h2>
//           <ul>
//             {roles.map((role) => (
//               <li
//                 key={role.id}
//                 onClick={() => handleRoleSelect(role)}
//                 className={`role-item ${
//                   selectedRole?.id === role.id ? "selected" : ""
//                 }`}
//               >
//                 {role.name}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Permissions Management */}
//         {selectedRole && (
//           <div className="permissions-details">
//             <h2>{selectedRole.name} Permissions</h2>
//             <div className="permissions-list">
//               {selectedRole.permissions.map((perm, index) => (
//                 <div key={index} className="permission-item">
//                   {perm}
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemovePermission(perm)}
//                   >
//                     &times;
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div className="add-permission">
//               <input
//                 type="text"
//                 placeholder="Add Permission"
//                 value={newPermission}
//                 onChange={(e) => setNewPermission(e.target.value)}
//               />
//               <button onClick={handleAddPermission} disabled={!newPermission}>
//                 Add
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PermissionsManagement;


import React, { useEffect, useState } from 'react';
import '../styles/Permission.css';
import { getRoles, getPermissions, updateRole, assignPermissions, removePermissions } from './apiService';

const PermissionManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Fetch roles and permissions from API
    const fetchData = async () => {
      const fetchedRoles = await getRoles();
      const fetchedPermissions = await getPermissions();
      setRoles(fetchedRoles);
      setPermissions(fetchedPermissions);
    };
    fetchData();
  }, []);

  const handleRoleSelect = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role);
  };

  const handlePermissionChange = async (module, action, isGranted) => {
    if (!selectedRole) return;

    if (isGranted) {
      // Assign permission
      const updatedRole = await assignPermissions(selectedRole.id, {
        [module]: [...(selectedRole.permissions[module] || []), action],
      });
      setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
      setSelectedRole(updatedRole);
    } else {
      // Remove permission
      const updatedRole = await removePermissions(selectedRole.id, [action]);
      setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
      setSelectedRole(updatedRole);
    }
  };

  return (
    <div className="rbac-container">
      <div className="role-list">
        <h3>Roles</h3>
        {roles.map((role) => (
          <div
            key={role.id}
            className={`role-item ${selectedRole?.id === role.id ? 'active' : ''}`}
            onClick={() => handleRoleSelect(role.id)}
          >
            {role.name}
          </div>
        ))}
      </div>
      <div className="permission-panel">
        <h3>{selectedRole ? `${selectedRole.name} Permissions` : 'Select a Role'}</h3>
        {selectedRole &&
          permissions.map(({ module, actions }) => (
            <div key={module} className="module">
              <h4>{module}</h4>
              <div className="permissions">
                {actions.map((action) => (
                  <label key={action}>
                    <input
                      type="checkbox"
                      checked={
                        selectedRole.permissions[module]?.includes(action) || false
                      }
                      onChange={(e) =>
                        handlePermissionChange(module, action, e.target.checked)
                      }
                    />
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PermissionManagement;
