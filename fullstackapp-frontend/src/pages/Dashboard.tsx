
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import LogoutButton from "../components/LogoutButton";

type Account = {
  accountId: number;
  accountType: string;
  lastFourDigits: string;
  balance: number;
  currency: string;
};

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiClient.get<Account[]>("/api/accounts");

        if (!Array.isArray(response.data)) {
          throw new Error("The accounts API did not return an array.");
        }

        setAccounts(response.data);
      } catch (err) {
        console.error("Failed to load accounts:", err);
        setError("Unable to load your accounts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadAccounts();
  }, []);

  function formatBalance(balance: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(balance);
  }

  return (
    <main className="container py-4">
      <header>
        <h1>Customer Dashboard</h1>
        <p>Consumer &amp; Community Banking</p>
        <LogoutButton />
      </header>

      <section aria-labelledby="accounts-heading" className="my-4">
        <h2 id="accounts-heading">Your accounts</h2>

        {loading && <p role="status">Loading accounts...</p>}

        {error && (
          <div role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && accounts.length === 0 && (
          <p>You don't have any accounts to display yet.</p>
        )}

        {!loading && !error && accounts.length > 0 && (
          <div>
            {accounts.map((account) => (
              <article key={account.accountId} className="card p-3 mb-3">
                <h3>{account.accountType} account</h3>
                <p>Account ending in: {account.lastFourDigits}</p>
                <p>
                  Balance:{" "}
                  {formatBalance(account.balance, account.currency)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="support-heading" className="my-4">
        <h2 id="support-heading">Need help?</h2>
        <p>
          Have a question about your checking or savings account?
        </p>
        <Link to="/support">Submit a support request</Link>
      </section>
    </main>
  );
}
