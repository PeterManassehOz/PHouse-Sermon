import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';  // Import PropTypes

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Decode token payload

    if (!user || !user.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// ✅ Add prop validation
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Ensures children is a valid React node
};

export default ProtectedRoute;
