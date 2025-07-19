import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { API_BASE_URL } from "@/lib/api";
import { useAuthActions, type User } from "@/stores/auth-store";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    setError
  } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404)
          setError("username", { type: "manual", message: "Tên đăng nhập không tồn tại" });
        else if (response.status === 400)
          setError("password", { type: "manual", message: "Mật khẩu không chính xác" });
        else
          setError("root.serverError", { type: "manual", message: "Đã xảy ra lỗi. Vui lòng thử lại." });
        
        return;
      }

      const { access_token, user } = await response.json();
      login(user, access_token);
      navigate("/");
    }
    catch (error) {
      console.error("Login failed:", error);
      setError("root.serverError", {
        type: "manual",
        message: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[22px]">
      <div className="flex flex-col items-center sm:gap-2 gap-0.5">
        <LogIn className="sm:h-12 h-10 sm:w-12 w-10" />
        <h1 className="sm:text-3xl text-2xl font-bold">Welcome</h1>
        <p className="text-muted-foreground text-sm">Đăng nhập</p>
      </div>

      <div className="space-y-3.5">
        <Input
          autoComplete="username"
          type="text"
          placeholder="Tên đăng nhập"
          {...register("username")}
          aria-invalid={!!errors.username?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm"
        />
        {errors.username?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2 pt-1">
            {errors.username?.message}
          </p>
        )}

        <Input
          type="password"
          placeholder="Mật khẩu"
          {...register("password")}
          aria-invalid={!!errors.password?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm"
          autoComplete="current-password"
        />
        {errors.password?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2 pt-1">
            {errors.password?.message}
          </p>
        )}
      </div>

      {errors.root?.serverError && (
        <p className="text-red-500 dark:text-red-500/90 text-sm pl-2 pt-1">
          {errors.root?.serverError?.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <div className="text-center">
        <Link
          to={isSubmitting ? "#" : "/auth?tab=signup"}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-[#a1a1a1] dark:hover:text-white transition-colors"
        >
          Chưa có tài khoản? <span className="font-semibold">Đăng ký</span>
        </Link>
      </div>
    </form>
  );
}
