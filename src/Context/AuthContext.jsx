import React, { createContext, useState, useEffect, useContext } from 'react';

// Create AuthContext to hold user authentication data
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data (id, name, role, etc.)

  useEffect(() => {
    // Fetch stored user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user data from localStorage to state
    }
  }, []);

  // Login function: Set the user in state and store in localStorage
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
    setUser(userData); // Update state with user data
  };

  // Logout function: Remove user from state and localStorage
  const logout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    setUser(null); // Reset user state
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext in other components
export const useAuth = () => useContext(AuthContext);
