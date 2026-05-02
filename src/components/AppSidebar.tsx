import { useState } from "react";
import { Menu } from "primereact/menu";
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // ✅ FIX
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const AppSidebar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false); // ✅ MISSING STATE

    // 🎯 Role-based menu items
    const getMenuItems = () => {
        if (user?.role === "admin") {
            return [
                {
                    label: "Dashboard",
                    icon: "pi pi-home",
                    command: () => navigate("/dashboard"),
                },
                {
                    label: "Admin Panel",
                    icon: "pi pi-users",
                    command: () => navigate("/dashboard"),
                },
                {
                    label: "Reports",
                    icon: "pi pi-chart-bar",
                },
            ];
        }

        if (user?.role === "support") {
            return [
                {
                    label: "Dashboard",
                    icon: "pi pi-home",
                    command: () => navigate("/dashboard"),
                },
                {
                    label: "Tickets",
                    icon: "pi pi-inbox",
                },
                {
                    label: "Customers",
                    icon: "pi pi-users",
                },
            ];
        }

        // 💊 Pharmacist (default)
        return [
            {
                label: "Dashboard",
                icon: "pi pi-home",
                command: () => navigate("/dashboard"),
            },
            {
                label: "Medicines",
                icon: "pi pi-shopping-bag",
            },
            {
                label: "Orders",
                icon: "pi pi-shopping-cart",
            },
        ];
    };

    return (
        <>
            {/* 🔥 Toggle Button */}
            <Button
                icon="pi pi-bars"
                className="p-button-text"
                onClick={() => setVisible(true)}
            />

            {/* 🔥 Sidebar Drawer */}
            <PrimeSidebar
                visible={visible}
                onHide={() => setVisible(false)}
                position="left"
                style={{ width: "260px" }}
            >
                <h3 style={{ marginBottom: "1rem" }}>My App</h3>

                <Menu model={getMenuItems()} />
            </PrimeSidebar>
        </>
    );
};

export default AppSidebar;