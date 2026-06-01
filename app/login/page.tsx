"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/api/supabase/client";
import {
  loginSchema,
  LoginSchema,
  signUpSchema,
  SignUpSchema,
} from "@/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const signUpForm = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onLogin = async (data: LoginSchema) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/select");
  };

  const onSignUp = async (data: SignUpSchema) => {
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    await supabase.from("profiles").insert({
      user_id: authData.user!.id,
      username: data.username,
    });
    router.push("/select");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">TypeForge</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          {isSignUp ? (
            <form
              onSubmit={signUpForm.handleSubmit(onSignUp)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  メールアドレス
                </label>
                <input
                  {...signUpForm.register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-red-500 text-xs">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  パスワード
                </label>
                <input
                  {...signUpForm.register("password")}
                  type="password"
                  placeholder="6文字以上"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-red-500 text-xs">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  ユーザー名
                </label>
                <input
                  {...signUpForm.register("username")}
                  type="text"
                  placeholder="ユーザー名"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {signUpForm.formState.errors.username && (
                  <p className="text-red-500 text-xs">
                    {signUpForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors text-sm"
              >
                アカウント作成
              </button>
            </form>
          ) : (
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  メールアドレス
                </label>
                <input
                  {...loginForm.register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-xs">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  パスワード
                </label>
                <input
                  {...loginForm.register("password")}
                  type="password"
                  placeholder="6文字以上"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-xs">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors text-sm"
              >
                ログイン
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500">
          {isSignUp
            ? "すでにアカウントをお持ちの方は"
            : "アカウントをお持ちでない方は"}
          <button
            onClick={() => setIsSignUp((v) => !v)}
            className="ml-1 font-bold text-indigo-600 hover:underline"
          >
            {isSignUp ? "ログイン" : "新規登録"}
          </button>
        </p>
      </div>
    </div>
  );
}
