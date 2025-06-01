import { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

// Removed useAuth hook to comply with Fast Refresh requirements.

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    
    if (userId && token) {
      setCurrentUser(userId);
      setUserRole(role);
      setUserName(name);
    }
    setLoading(false); // Finished checking localStorage
  }, []);

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUserRole(null);
    setUserName(null);
    window.location.href = '/login';
  };

  // Build full user object for pages
  const user = currentUser
    ? { linkedId: parseInt(currentUser), role: userRole, name: userName }
    : null;
  const value = {
    currentUser,
    userRole,
    userName,
    user,
    setCurrentUser,
    setUserRole,
    setUserName,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;

// Named hook for consuming AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
