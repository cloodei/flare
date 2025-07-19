import { Navigate, Outlet } from "react-router";
import { API_BASE_URL } from "@/lib/api";
import { useAuthActions } from "@/stores/auth-store";

export default function ProtectedRoute() {
  const { login, logout } = useAuthActions();

  async function checkToken() {
    const accessToken = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (accessToken && user) {
      const checkAT = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (checkAT.ok) {
        login(user, accessToken);
        return true;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to refresh token");

        const { access_token: newAccessToken, user } = result;
        login(user, newAccessToken);
        
        return true;
      }
      catch (error) {
        console.error("Session expired. Please log in again.", error);
        logout();

        return false;
      }
    }
    else {
      logout();
      return false;
    }
  }

  if (!checkToken())
    return <Navigate to="/auth" replace />;

  return <Outlet />;
}
