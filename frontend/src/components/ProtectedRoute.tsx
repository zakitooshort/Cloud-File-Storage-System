import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;