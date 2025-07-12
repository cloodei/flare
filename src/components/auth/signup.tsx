import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { User } from "lucide-react";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";

interface SignupFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    getValues,
    watch
  } = useForm<SignupFormData>();

  function onSubmit(data: SignupFormData) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[22px]">
      <div className="flex flex-col items-center sm:gap-2 gap-0.5">
        <User className="sm:h-12 h-10 sm:w-12 w-10" />
        <h1 className="sm:text-3xl text-2xl font-bold">Tạo tài khoản</h1>
        <p className="text-muted-foreground text-sm">Đăng ký</p>
      </div>

      <div className="space-y-3.5">
        <Input
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
          })}
          aria-invalid={!!errors.username?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm"
          style={{ marginBottom: "0px" }}
        />
        {errors.username?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2">
            {errors.username?.message}
          </p>
        )}

        <PasswordInput
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
          })}
          aria-invalid={!!errors.password?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm mt-3.5"
          style={{ marginBottom: "0px" }}
        />
        {errors.password?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2">
            {errors.password?.message}
          </p>
        )}

        <PasswordInput
          placeholder="Nhập lại mật khẩu"
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) => value === getValues("password") || "Mật khẩu không khớp"
          })}
          aria-invalid={!!errors.confirmPassword?.message}
          className="max-sm:text-sm h-[38px] sm:h-10 max-sm:placeholder:text-sm mt-3.5"
          style={{ marginBottom: "0px" }}
        />
        {errors.confirmPassword?.message && (
          <p className="text-red-500 dark:text-red-500/90 text-sm pl-2">
            {errors.confirmPassword?.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
      </Button>

      <div className="text-center">
        <Link
          to={isSubmitting ? "#" : "/login?tab=login"}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-[#a1a1a1] dark:hover:text-white transition-colors"
        >
          Đã có tài khoản? <span className="font-semibold">Đăng nhập</span>
        </Link>
      </div>
    </form>
  );
}
