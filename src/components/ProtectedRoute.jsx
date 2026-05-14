import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, requiredRole = null }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-container">Загружаем...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
