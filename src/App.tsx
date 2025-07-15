import { useEffect } from "react";
import { Routes, Route } from "react-router";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/protected-route";
import { useAuthActions } from "./stores/auth-store";
import { fetchWithAuth, API_BASE_URL } from "./lib/api";

export default function App() {
  const { logout, login } = useAuthActions();

  useEffect(() => {
    async function checkToken() {
      const accessToken = localStorage.getItem("access_token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (accessToken && user) {
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${accessToken}`);
        headers.set("Content-Type", "application/json");

        const checkAT = await fetch(`${API_BASE_URL}/me`, {
          method: "GET",
          headers,
        });
        if (checkAT.ok) {
          const { user, access_token } = await checkAT.json();
          login(user, access_token);
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Failed to refresh token");
          }

          const { access_token: newAccessToken, user } = result;
          console.log("Token refreshed successfully.");
          login(user, newAccessToken);
        }
        catch (error) {
          console.error("Session expired. Please log in again.", error);
          logout();
        }
      }
      else logout();
    }
    checkToken();
  }, []);

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}
