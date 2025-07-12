import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors }
  } = useForm<LoginFormData>();

  function onSubmit(data: LoginFormData) {
    console.log(data);
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
          {...register("username", {
              required: "Tên đăng nhập không được để trống",
              minLength: {
                value: 3,
                message: "Tên đăng nhập phải có ít nhất 3 ký tự"
              },
              maxLength: {
                value: 20,
                message: "Tên đăng nhập phải có tối đa 20 ký tự"
              }
            }
          )}
          aria-invalid={!!errors.username?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm"
          style={{ marginBottom: "0px" }}
        />
        {errors.username?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2">
            {errors.username?.message}
          </p>
        )}

        <Input
          type="password"
          placeholder="Mật khẩu"
          {...register("password", {
              required: "Mật khẩu không được để trống",
              minLength: {
                value: 3,
                message: "Mật khẩu phải có ít nhất 3 ký tự"
              },
              maxLength: {
                value: 20,
                message: "Mật khẩu phải có tối đa 20 ký tự"
              }
            }
          )}
          aria-invalid={!!errors.password?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm mt-3.5"
          style={{ marginBottom: "0px" }}
          autoComplete="password"
        />
        {errors.password?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2">
            {errors.password?.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <div className="text-center">
        <Link
          to={isSubmitting ? "#" : "/login?tab=signup"}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-[#a1a1a1] dark:hover:text-white transition-colors"
        >
          Chưa có tài khoản? <span className="font-semibold">Đăng ký</span>
        </Link>
      </div>
    </form>
  );
}
