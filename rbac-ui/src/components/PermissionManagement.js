import React, { useEffect, useState } from 'react';
import '../styles/Permission.css';
import { getRoles, getPermissions, assignPermissions, removePermissions } from './apiService';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

const PermissionManagement = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedRoles = await getRoles();
        const fetchedPermissions = await getPermissions();
        setRoles(fetchedRoles);
        setPermissions(fetchedPermissions);
      } catch (error) {
        setMessage('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleSelect = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role);
  };

  const handlePermissionChange = async (module, action, isGranted) => {
    if (!selectedRole) return;

    try {
      if (isGranted) {
        const updatedRole = await assignPermissions(selectedRole.id, {
          [module]: [...(selectedRole.permissions[module] || []), action],
        });
        setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
        setSelectedRole(updatedRole);
        setMessage('Permission granted successfully!');
      } else {
        const updatedRole = await removePermissions(selectedRole.id, [action]);
        setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
        setSelectedRole(updatedRole);
        setMessage('Permission removed successfully!');
      }
    } catch (error) {
      setMessage('Error updating permission.');
    }
  };

  return (
    <div className="rbac-container">
      <div className="role-list">
        <h3>Roles</h3>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id}
              className={`role-card ${selectedRole?.id === role.id ? 'active' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="role-card-content">
                <h4>{role.name}</h4>
                <p>{role.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="permission-panel">
        <h3>{selectedRole ? `${selectedRole.name} Permissions` : 'Select a Role'}</h3>

        {message && <div className="message">{message}</div>}

        {selectedRole &&
          permissions.map(({ module, actions }) => (
            <div key={module} className="module-card">
              <div className="module-header">
                <h4>{module}</h4>
                <FaInfoCircle className="info-icon" />
              </div>
              <div className="permissions">
                {actions.map((action) => (
                  <label key={action} className="permission-label">
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
                    {selectedRole.permissions[module]?.includes(action) ? (
                      <FaCheck className="check-icon" />
                    ) : (
                      <FaTimes className="times-icon" />
                    )}
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
