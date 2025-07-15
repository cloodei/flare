import { useUser } from "@/stores/auth-store";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const user = useUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
