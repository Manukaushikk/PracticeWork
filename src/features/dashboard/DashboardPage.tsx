import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { useAppDispatch } from "../../app/hooks";
import { useAuth } from "../../hooks/useAuth";
import { clearAuth } from "../auth/authSlice";
import { logoutUser } from "../../firebase/authHelpers";
import Sidebar from "../../components/AppSidebar";
import AppSidebar from "../../components/AppSidebar";

const DashboardPage = () => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();       // Sign out from Firebase
        dispatch(clearAuth());    // Clear Redux store
        navigate("/login");       // Go back to login
    };

    // Get initials for the avatar (e.g. "John Doe" → "JD")
    const getInitials = (email: string | null) => {
        if (!email) return "U";
        return email.charAt(0).toUpperCase();
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "var(--surface-ground)",
            }}
        >
            {/* ── TOP NAVBAR ── */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 2rem",
                    background: "var(--surface-card)",
                    borderBottom: "1px solid var(--surface-border)",
                }}
            >
                {/* LEFT SIDE */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>

                    {/* 🔥 Sidebar Toggle */}
                    <AppSidebar />

                    <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
                        <i className="pi pi-home" style={{ marginRight: "0.5rem" }} />
                        Dashboard
                    </h1>
                </div>

                {/* RIGHT SIDE */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Avatar
                        label={getInitials(user?.email ?? null)}
                        shape="circle"
                        style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                    />

                    <span style={{ color: "var(--text-color-secondary)" }}>
                        {user?.email}
                    </span>

                    <Tag value={user?.role} severity="info" />

                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        severity="secondary"
                        outlined
                        onClick={handleLogout}
                    />
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{ padding: "2rem" }}>

                {/* ── STATS ROW ── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        marginBottom: "2rem",
                    }}
                >
                    {[
                        { label: "Total Users", value: "1,240", icon: "pi-users", color: "#6366f1" },
                        { label: "Active Sessions", value: "87", icon: "pi-desktop", color: "#22c55e" },
                        { label: "Revenue", value: "₹4.2L", icon: "pi-indian-rupee", color: "#f59e0b" },
                        { label: "Errors Today", value: "3", icon: "pi-exclamation-triangle", color: "#ef4444" },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: stat.color + "20",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <i
                                        className={`pi ${stat.icon}`}
                                        style={{ color: stat.color, fontSize: "1.4rem" }}
                                    />
                                </div>

                                <div>
                                    <p style={{ margin: 0, color: "var(--text-color-secondary)", fontSize: "0.85rem" }}>
                                        {stat.label}
                                    </p>
                                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* ── USER INFO ── */}
                <Card title="Your Account">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <i className="pi pi-envelope" />
                            <span>{user?.email}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <i className="pi pi-id-card" />
                            <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                                {user?.uid}
                            </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <i className="pi pi-verified" />
                            <Tag
                                value={user?.emailVerified ? "Email Verified" : "Not Verified"}
                                severity={user?.emailVerified ? "success" : "warning"}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;