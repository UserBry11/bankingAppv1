import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import SupportPage from "./pages/SupportPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>}/>
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
