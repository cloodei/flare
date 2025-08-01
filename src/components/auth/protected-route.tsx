import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { base } from "@/lib/api";
import { useAuthActions, type User } from "@/stores/auth-store";

async function checkSession() {
  const accessToken = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");

  if (accessToken && user) {
    try {
      const response = await fetch(`${base}/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const text = await response.text();
        console.error("Session expired. Error:", text);
        return false;
      }

      const data = await response.json();
      return {
        accessToken: data.access_token as string,
        user: data.user as User
      };
    }
    catch (error) {
      console.error("Session expired. Error:", error);
      return false;
    }
  }

  try {
    const response = await fetch(`${base}/refresh`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Session expired. Error:", text);
      return false;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token as string,
      user: data.user as User
    };
  }
  catch (error) {
    console.error("Session expired. Error:", error);
    return false;
  }
}

export default function ProtectedRoute() {
  const { login, logout } = useAuthActions();
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);

  useEffect(() => {
    checkSession().then(result => {
      if (result) {
        login(result.user, result.accessToken);
        setCheck(false);
      }
      else {
        logout();
        setCheck(true);
      }

      setLoading(false);
    });
  }, []);

  if (loading)
    return <Loading />;

  if (check)
    return <Navigate to="/auth" replace />;

  return <Outlet />;
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          <Loader2 className="size-4 mr-1 animate-spin" />
          Đang tải...
        </h2>
        <p className="text-muted-foreground">
          Đợi tí...
        </p>
      </div>
    </div>
  );
}
