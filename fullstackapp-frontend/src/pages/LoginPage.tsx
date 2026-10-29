import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if(!loading && user){
        navigate("/dashboard", {replace: true});
    }
  }, [loading, user, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          "Unable to log in. Check your connection and try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container py-5">
      <section
        className="mx-auto"
        style={{ maxWidth: "440px" }}
        aria-labelledby="login-heading"
      >
        <header className="mb-4 text-center">
          <h1 id="login-heading">Community Banking</h1>
          <p>Sign in to access your accounts.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-danger" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={submitting || loading}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center">
          New customer? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}