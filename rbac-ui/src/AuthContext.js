import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

// Provider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user info 

  // Login function to authenticate the user
  const login = (username) => {
    setUser({ username, isAdmin: username === "admin" }); 
  };

  const logout = () => {
    setUser(null); // Clears user information
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
