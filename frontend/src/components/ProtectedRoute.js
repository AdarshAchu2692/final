import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export const CreatorRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isCreator = localStorage.getItem('isCreator') === 'true';
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isCreator) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};