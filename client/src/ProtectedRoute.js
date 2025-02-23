import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './provider/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If no user, navigate to login
  if (!user) {
    navigate('/login', { replace: true });
    return null; // You can return null or an empty fragment while navigating
  }

  return children;
};

export default ProtectedRoute;
