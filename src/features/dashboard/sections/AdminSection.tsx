import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

const roles = [
    { label: "Admin", value: "admin" },
    { label: "Support", value: "support" },
    { label: "Pharmacist", value: "pharmacist" },
];

const AdminPanel = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUsers(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (uid: string, role: string) => {
        try {
            await updateDoc(doc(db, "users", uid), {
                role,
            });

            setSuccess("Role updated successfully ✅");
            fetchUsers(); // refresh list
        } catch {
            setSuccess("Failed to update role ❌");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center mt-5">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <Card title="Admin Panel 👑" className="mt-4">
            {success && (
                <Message severity="info" text={success} className="mb-3" />
            )}

            <div className="flex flex-column gap-3">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex justify-content-between align-items-center border-1 border-round p-3"
                    >
                        <div>
                            <p style={{ margin: 0, fontWeight: 500 }}>{user.email}</p>
                            <small style={{ color: "gray" }}>{user.id}</small>
                        </div>

                        <Dropdown
                            value={user.role}
                            options={roles}
                            onChange={(e) =>
                                handleRoleChange(user.id, e.value)
                            }
                            placeholder="Select Role"
                            style={{ width: "180px" }}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AdminPanel;