const API_BASE_URL = import.meta.env.VITE_API_URL!;

// async function fetchWithAuth(url: string, options: RequestInit = {}) {
//   const headers = new Headers(options.headers || {});
  
//   const accessToken = useAccessToken();
//   if (accessToken) {
//     headers.set("Authorization", `Bearer ${accessToken}`);
//   }

//   options.headers = headers;
//   let response = await fetch(`${API_BASE_URL}${url}`, options);

//   if (response.status === 401) {
//     try {
//       const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!refreshResponse.ok) {
//         throw new Error("Failed to refresh token");
//       }

//       const { access_token: newAccessToken, user } = await refreshResponse.json();
//       login(user, newAccessToken);

//       headers.set("Authorization", `Bearer ${newAccessToken}`);
//       options.headers = headers;
//       response = await fetch(`${API_BASE_URL}${url}`, options);
//     }
//     catch (error) {
//       console.error("Session expired. Please log in again.", error);
//       logout();
//       window.location.href = "/auth?tab=login";
//       return response;
//     }
//   }

//   return response;
// }

export { API_BASE_URL };
