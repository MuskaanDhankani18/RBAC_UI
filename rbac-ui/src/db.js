export const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
];
  
export const roles = [
  { id: 1, name: 'Admin', permissions: { posts: ['read', 'write', 'update', 'delete'] }},
  { id: 2, name: 'Editor', permissions: { posts: ['read', 'write', 'update'] }},
  { id: 3, name: 'Viewer', permissions: { posts: ['read'] } },
];

export const permissions = [
  { module: 'posts', actions: ['read', 'write', 'update', 'delete'] },
  { module: 'users', actions: ['read', 'manage'] },
];

// Mock Report Data (for activity logging)
export const reportData = [
  { date: "2024-11-20", user: "John Doe", action: "Created User", status: "Success" },
  { date: "2024-11-21", user: "Jane Smith", action: "Updated Role", status: "Success" },
  { date: "2024-11-22", user: "Alice Johnson", action: "Deleted User", status: "Failed" },
  { date: "2024-11-23", user: "Bob Brown", action: "Created Role", status: "Success" }
];