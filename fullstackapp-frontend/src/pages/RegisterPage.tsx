import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, type FormEvent } from "react";
import { registerUser } from "../api/authApi";
import axios from "axios";


export default function RegisterPage(){
    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        
        if(password.length < 8) {
            setError("Your password must be at least 8 characters.");
            return;
        }

        if(password !== confirmPassword){
            setError("Your passwords do not match");
            return;
        }

        setSubmitting(true);

        try {
            const cleanUsername = username.trim();
            await registerUser({
                name: name.trim(),
                username: cleanUsername,
                password,
            });
            
            await login(cleanUsername, password);
            navigate("/dashboard", {replace: true});
        } catch (err) {
            if(axios.isAxiosError(err) && err.response?.status === 400){
                setError("Please check your details and password length");
            } else {
                setError("Registration could not be completed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <main>
            <section aria-labelledby="register-heading">
                <header>
                    <h1 id="register-heading">Create your account</h1>
                    <p>Set up your Community Banking demo login</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Full name</label>
                        <input 
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="username">Username</label>
                        <input 
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="new-password">Password</label>
                        <input 
                            id="new-password"
                            name="new-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                        <div>Use at least 8 characters.</div>
                    </div>

                    <div>
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input 
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p role="alert">{error}</p>
                    )}

                    <button type="submit" disabled={submitting}>
                        {submitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p>
                    Already registered? <Link to="/login">Sign in</Link>
                </p>
            </section>
        </main>
    )
}