import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute(){
    const { user, loading } = useAuth();

    if(loading) {
        return (
            <main aria-busy="true">
                <p role="status">Checking your session...</p>
            </main>
        );
    }

    if(!user){
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}