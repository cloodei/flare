import { useAuthActions, useAccessToken } from "@/stores/auth-store";

const API_BASE_URL = process.env.API_URL!;
const { setAccessToken, setUser, logout } = useAuthActions();

// The core fetch function that handles token attachment and refreshing
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const accessToken = useAccessToken();

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  options.headers = headers;

  let response = await fetch(`${API_BASE_URL}${url}`, options);

  // If the token has expired (401), try to refresh it
  if (response.status === 401) {
    console.log("Access token expired. Attempting to refresh...");
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh token");
      }

      const { access_token: newAccessToken, user } = await refreshResponse.json();

      // Update the store with the new token and user
      setAccessToken(newAccessToken);
      setUser(user);
      console.log("Token refreshed successfully.");

      // Retry the original request with the new token
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      options.headers = headers;
      response = await fetch(`${API_BASE_URL}${url}`, options);

    } catch (error) {
      console.error("Session expired. Please log in again.", error);
      // If refresh fails, log the user out
      logout();
      // Redirect to login page
      window.location.href = "/auth?tab=login";
      // Return the original failed response to prevent further processing
      return response;
    }
  }

  return response;
};

export { fetchWithAuth };
