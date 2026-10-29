import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

export default function SupportPage() {
    const [category, setCategory] = useState<string>("Account inquiry");
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        setStatus("");
        setError("");
        setSubmitting(true);
        try {
            const response = await axios.post("http://localhost:8080/api/support-request", {category, subject, message})
            setMessage(response.data.message);
        } catch {
            setError("Your request could not be submitted. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main>
          <Link to="/dashboard" >
            <button>&larr; Back to dashboard</button>
          </Link>

          <h1>Customer support</h1>
          <LogoutButton />
          <p>How can our Consumer &amp; Community Banking team help?</p>

          <form onSubmit={handleSubmit}>
            <label>Support category </label>
            <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
            >
                <option>Account Inquiry</option>
                <option>Checking Account</option>
                <option>Savings Account</option>
                <option>Online Banking</option>
                <option>Other</option>

            </select>
            <p>

            <label>Subject </label>
            <input 
                id="subject" 
                type="text" 
                value={subject} 
                onChange={(event) => setSubject(event.target.value)} 
                maxLength={100}
                required
                placeholder="Briefly describe your issue"
            />
            </p>

            <label>Message </label>
            <textarea
                id="message" data-testid="message1"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={2000}
                required
                placeholder="How can we help you?"
            />

            {status && (
                <div role="status">{status}</div>
            )}

            {error && (
                <div role="alert">{error}</div>
            )}

            <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit request"}
            </button>
          </form>
        <section>==============================================</section>
        <p role="alert">
            <span>Message response: {message}</span>
        </p>
        </main>
    )

}