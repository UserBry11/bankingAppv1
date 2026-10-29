import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function LogoutButton(){
    const { logout }  = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleLogout(){
        setSubmitting(true);
        setError("");

        try {
            await logout();
            navigate("/login", { replace: true});
        } catch {
            setError("Unable to log out. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                disabled={submitting}
            >
                {submitting ? "Signing out...": "Sign out"}
            </button>

            {error && <p role="alert">{error}</p>}
        </div>
    )
}