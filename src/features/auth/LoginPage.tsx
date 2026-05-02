import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { getUserRole, loginUser } from "../../firebase/authHelpers";
import { setUser, setError, setLoading, setTwoFactorPending } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const LoginPage = () => {
    // Local state — just for the form inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Get dispatch to send actions to Redux
    const dispatch = useAppDispatch();

    // Read loading/error from Redux store
    const { loading, error } = useAppSelector((s) => s.auth);

    // Used to navigate to another page after login
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            dispatch(setError("Please fill in all fields"));
            return;
        }

        dispatch(setLoading(true));

        try {
            const firebaseUser = await loginUser(email, password);

            // Get role from Firestore
            const role = await getUserRole(firebaseUser.uid);

            // Store user + role in Redux
            dispatch(
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                    role,
                })
            );

            // 2FA step (same as before)
            dispatch(setTwoFactorPending(true));

            navigate("/two-factor");
        } catch (err: any) {
            dispatch(setError(err.message || "Login failed"));
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
            <Card
                title="Welcome Back"
                subTitle="Sign in to your account"
                style={{ width: "400px" }}
            >
                {/* Show error if any */}
                {error && (
                    <Message severity="error" text={error} style={{ marginBottom: "1rem", width: "100%" }} />
                )}

                <div className="flex flex-column gap-3">
                    {/* Email field */}
                    <div className="flex flex-column gap-1">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            type="email"
                        />
                    </div>

                    {/* Password field — PrimeReact's Password shows/hides the text */}
                    <div className="flex flex-column gap-1">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password"
                            feedback={false} // Don't show strength meter on login
                            toggleMask     // Show eye icon to reveal password
                            style={{ width: "100%" }}
                            inputStyle={{ width: "100%" }}
                        />
                    </div>

                    {/* Login button */}
                    <Button
                        label="Sign In"
                        icon="pi pi-sign-in"
                        loading={loading}
                        onClick={handleLogin}
                        className="mt-2"
                    />

                    {/* Link to register */}
                    <Button
                        label="Don't have an account? Register"
                        link
                        onClick={() => navigate("/register")}
                    />
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;