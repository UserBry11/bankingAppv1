import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

type Account = {
    accountId: number;
    accountType: string,
    lastFourDigits: string,
    balance: number;
    currency: string,
}

export default function DashboardPage(){
    const [accounts, setAccounts] = useState<Account[]>([{"accountId": 1234, "accountType": "Savings", "lastFourDigits": "7432", "balance": 3882.73, "currency": "USD"}, {"accountId": 3829, "accountType": "Checking", "lastFourDigits": "9823", "balance": 2433.33, "currency": "CAD"}]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function loadAccounts(){
            try {
                setLoading(true);
                const response = await axios.get<Account[]>("http://localhost:8080/api/accounts");
                setAccounts(response.data);
            } catch {
                setError("Unable to load your accounts. Please try again.");
            } finally {
                setLoading(false);
            }


        }
        loadAccounts();
    },[]);

    function formatBalance(balance: number, currency: string){

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(balance);
    }

    return (
        <main>
            <h1>Customer Dashboard</h1>
            <p>Consumer &amp; Community Banking</p>

            <Link to="/support">
                <button>Contact Support</button>
            </Link>

            <h2>Your accounts</h2>

            {loading && <p>Loading accounts...</p>}
            {error && (<div role="alert">{error}</div>)}

            {!loading && !error && (
                <div>
                    {accounts.map((account) => (
                        <div key={account.accountId}>
                            <h3>{account.accountType} account</h3>
                            <p>Account ending in: {account.lastFourDigits}</p>
                            <p>{formatBalance(account.balance, account.currency)}</p>
                        </div>
                    ))}
                </div>
            )}


            <section>
                <h2>Need help?</h2><p>Have a question about your checking or savings account?</p>
                <Link to="/support"><button>Submit a support request</button></Link>
            </section>

        </main>
    )
}