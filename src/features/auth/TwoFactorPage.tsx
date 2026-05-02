import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/config";
import { setTwoFactorPending } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const TwoFactorPage = () => {
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();

    // Resend the verification email
    const handleResend = async () => {
        setResendLoading(true);
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                setResendSuccess(true);
            }
        } catch {
            setError("Failed to resend. Try again in a moment.");
        } finally {
            setResendLoading(false);
        }
    };

    // Verify: reload the Firebase user to check emailVerified
    const handleVerify = async () => {
        if (!auth.currentUser) return;

        try {
            await auth.currentUser.reload();

            if (auth.currentUser.emailVerified) {
                dispatch(setTwoFactorPending(false));

                // Always go to dashboard
                navigate("/dashboard");
            } else {
                setError("Email not verified yet. Check your inbox and click the link.");
            }
        } catch {
            setError("Verification check failed. Please try again.");
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
                title="Two-Factor Verification"
                subTitle={`A verification link was sent to ${user?.email}`}
                style={{ width: "420px", textAlign: "center" }}
            >
                {error && (
                    <Message severity="error" text={error} style={{ marginBottom: "1rem", width: "100%" }} />
                )}
                {resendSuccess && (
                    <Message severity="success" text="Verification email resent!" style={{ marginBottom: "1rem", width: "100%" }} />
                )}

                <div className="flex flex-column align-items-center gap-4">
                    {/* Shield icon for visual clarity */}
                    <i className="pi pi-shield" style={{ fontSize: "3rem", color: "var(--primary-color)" }} />

                    <p style={{ color: "var(--text-color-secondary)", margin: 0 }}>
                        Click the link in your email, then press <strong>Verify</strong> below.
                    </p>

                    <Button
                        label="I've Verified My Email"
                        icon="pi pi-check-circle"
                        onClick={handleVerify}
                        className="w-full"
                    />

                    <Button
                        label="Resend Email"
                        icon="pi pi-refresh"
                        severity="secondary"
                        outlined
                        loading={resendLoading}
                        onClick={handleResend}
                        className="w-full"
                    />

                    <Button
                        label="Back to Login"
                        link
                        onClick={() => navigate("/login")}
                    />
                </div>
            </Card>
        </div>
    );
};

export default TwoFactorPage;