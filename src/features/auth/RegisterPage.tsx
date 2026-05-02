import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { registerUser } from "../../firebase/authHelpers";
import { setUser, setError, setLoading } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!email || !password) {
            dispatch(setError("Please fill all fields"));
            return;
        }
        if (password !== confirmPassword) {
            dispatch(setError("Passwords do not match"));
            return;
        }
        if (password.length < 6) {
            dispatch(setError("Password must be at least 6 characters"));
            return;
        }

        dispatch(setLoading(true));

        try {
            const firebaseUser = await registerUser(email, password);
            dispatch(
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                })
            );
            // After register, go to 2FA
            navigate("/two-factor");
        } catch (err: any) {
            dispatch(setError(err.message || "Registration failed"));
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--surface-ground)",
            }}
        >
            <Card title="Create Account" subTitle="Get started today" style={{ width: "400px" }}>
                {error && (
                    <Message severity="error" text={error} style={{ marginBottom: "1rem", width: "100%" }} />
                )}

                <div className="flex flex-column gap-3">
                    <div className="flex flex-column gap-1">
                        <label>Email</label>
                        <InputText
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            type="email"
                        />
                    </div>

                    <div className="flex flex-column gap-1">
                        <label>Password</label>
                        {/* feedback={true} shows a strength bar on register */}
                        <Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            feedback={true}
                            toggleMask
                            style={{ width: "100%" }}
                            inputStyle={{ width: "100%" }}
                        />
                    </div>

                    <div className="flex flex-column gap-1">
                        <label>Confirm Password</label>
                        <Password
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            feedback={false}
                            toggleMask
                            style={{ width: "100%" }}
                            inputStyle={{ width: "100%" }}
                        />
                    </div>

                    <Button
                        label="Create Account"
                        icon="pi pi-user-plus"
                        loading={loading}
                        onClick={handleRegister}
                        className="mt-2"
                    />

                    <Button
                        label="Already have an account? Sign In"
                        link
                        onClick={() => navigate("/login")}
                    />
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;