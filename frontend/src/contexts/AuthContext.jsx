import { createContext, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

// Removed useAuth hook to comply with Fast Refresh requirements.

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUser(userId);
    }
    setLoading(false); // Finished checking localStorage
  }, []);

  const logout = () => {
    localStorage.removeItem('userId');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const value = {
    currentUser,
    setCurrentUser,
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

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
