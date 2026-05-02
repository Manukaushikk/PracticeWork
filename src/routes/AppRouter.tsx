import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import TwoFactorPage from "../features/auth/TwoFactorPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes — anyone can visit */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/two-factor" element={<TwoFactorPage />} />

                {/* Protected route — only logged-in & verified users */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default: redirect root to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;