import { users, roles, permissions, reportData } from '../db';

// Simulate network delay
const simulateDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 500); // Simulate network delay
  });
};

/** USERS CRUD OPERATIONS **/

// Get all users
export const getUsers = async () => simulateDelay(users);

// Create a new user
export const createUser = async (newUser) => {
  const id = users.length ? users[users.length - 1].id + 1 : 1; // Generate unique ID
  const userWithId = { ...newUser, id };
  users.push(userWithId);
  
  // Add a new entry to the report data when a new user is added
  const newReportEntry = {
    date: new Date().toISOString().split('T')[0], // Get current date
    user: userWithId.name,
    action: "Created User",
    status: "Success"
  };
  reportData.push(newReportEntry);

  return simulateDelay(userWithId);
};

// Update a user by ID
export const updateUser = async (id, updatedUser) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser }; // Update user
    return simulateDelay(users[index]);
  }
  return simulateDelay(null); // User not found
};

// Delete a user by ID
export const deleteUser = async (id) => {
  const index = users.findIndex((user) => user.id === id);
  const name = users.at(index)?.name;
  
  if (index !== -1) {
    users.splice(index, 1); // Remove user from the list
  }

  const newReportEntry = {
    date: new Date().toISOString().split('T')[0], // Get current date
    user: name,
    action: "User Deleted",
    status: "Success"
  };
  reportData.push(newReportEntry);

  return simulateDelay(null); // Return null after deletion
};

/** ROLES CRUD OPERATIONS **/

// Get all roles
export const getRoles = async () => simulateDelay(roles);

// Create a new role
export const createRole = async (newRole) => {
  const id = roles.length ? roles[roles.length - 1].id + 1 : 1; // Generate unique ID
  const roleWithId = { ...newRole, id };
  roles.push(roleWithId);
  return simulateDelay(roleWithId);
};

// Update a role by ID
export const updateRole = async (id, updatedRole) => {
  const index = roles.findIndex((role) => role.id === id);
  if (index !== -1) {
    roles[index] = { ...roles[index], ...updatedRole }; // Update role
    return simulateDelay(roles[index]);
  }
  return simulateDelay(null); // Role not found
};

// Delete a role by ID
export const deleteRole = async (id) => {
  const index = roles.findIndex((role) => role.id === id);
  if (index !== -1) {
    roles.splice(index, 1); // Remove role from the list
  }
  return simulateDelay(null); // Return null after deletion
};

/** PERMISSIONS MANAGEMENT **/

// Get all permissions
export const getPermissions = async () => simulateDelay(permissions);

// Assign permissions to a role
export const assignPermissions = async (roleId, updatedPermissions) => {
  const index = roles.findIndex((role) => role.id === roleId);
  if (index !== -1) {
    roles[index].permissions = { ...roles[index].permissions, ...updatedPermissions };
    
    // Log permission assignment to the report
    const newReportEntry = {
      date: new Date().toISOString().split('T')[0], // Get current date
      user: `Role ${roles[index].name}`,
      action: "Permissions Assigned",
      status: "Success"
    };
    reportData.push(newReportEntry);

    return simulateDelay(roles[index]);
  }
  return simulateDelay(null); // Role not found
};

// Remove specific permissions from a role
export const removePermissions = async (roleId, permissionsToRemove) => {
  const index = roles.findIndex((role) => role.id === roleId);
  if (index !== -1) {
    roles[index].permissions = Object.entries(roles[index].permissions).reduce(
      (acc, [module, perms]) => {
        const filteredPerms = perms.filter((perm) => !permissionsToRemove.includes(perm));
        if (filteredPerms.length > 0) acc[module] = filteredPerms;
        return acc;
      },
      {}
    );

    // Log permission removal to the report
    const newReportEntry = {
      date: new Date().toISOString().split('T')[0], // Get current date
      user: `Role ${roles[index].name}`,
      action: "Permissions Removed",
      status: "Success"
    };
    reportData.push(newReportEntry);

    return simulateDelay(roles[index]);
  }
  return simulateDelay(null); // Role not found
};

// Report CRUD operations (for logging user activity)
export const getReportData = async () => simulateDelay(reportData);

// Optional: add a method for updating or managing the report data manually
export const addReportData = async (newReportEntry) => {
  reportData.push(newReportEntry);
  return simulateDelay(newReportEntry);
};


// Update role permissions (assign and remove in one call)
export const updateRolePermissions = async (roleId, updatedPermissions) => {
  const index = roles.findIndex((role) => role.id === roleId);
  if (index !== -1) {
    roles[index].permissions = updatedPermissions; // Replace all permissions with the updated set
    
    // Log the update to the report
    const newReportEntry = {
      date: new Date().toISOString().split('T')[0], // Get current date
      user: `Role ${roles[index].name}`,
      action: "Permissions Updated",
      status: "Success",
    };
    reportData.push(newReportEntry);

    return simulateDelay(roles[index]);
  }
  return simulateDelay(null); // Role not found
};


// Update a user's role by ID
export const updateUserRole = async (userId, newRoleId) => {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], roleId: newRoleId }; // Update the user's role
    return simulateDelay(users[index]);
  }
  return simulateDelay(null); // User not found
};
