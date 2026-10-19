import { useState, useEffect } from 'react'
// import './App.css'

import axios from 'axios'

function App() {
  const [message, setMessage] = useState("Axios call...");
  const [clickCount, setClickCount] = useState<number>(0);
  const [isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if(clickCount === 0) return;
    setIsLoading(true);

    setTimeout(() => {
        axios
        .get<string>("http://localhost:8080/api/v1/hello")
        .then((response) => setMessage(response.data))
        .catch(() => setMessage("Could not connect to backend"))
        .finally(() => setIsLoading(false));
      }, 500);
    }, [clickCount]);

  const handleButton = () => {
    setClickCount((prev) => prev + 1);
  }

  return (
    <main>
      <section id="center">
        <div>This is the frontend talking.</div>
        <button onClick={handleButton} disabled={isLoading}>
          {isLoading ? "Loading..." : "Axios call"}
        </button>

        <div style={{marginTop: '15px'}}>
          {isLoading ? (<p>Connecting to backend server...</p>): (<p>{message}</p>)}
        </div>
      </section>
    </main>
  )
}

export default App
