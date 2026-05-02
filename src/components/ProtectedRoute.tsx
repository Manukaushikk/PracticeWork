import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wrap any page that requires login with this component
// If not logged in → redirect to /login automatically
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, twoFactorPending, loading } = useAuth();

    // Wait until Firebase check finishes
    if (loading) return <div>Loading...</div>;

    // Not logged in at all
    if (!user) return <Navigate to="/login" replace />;

    // Logged in but 2FA not done yet
    if (twoFactorPending) return <Navigate to="/two-factor" replace />;

    // All good — render the actual page
    return <>{children}</>;
};

export default ProtectedRoute;