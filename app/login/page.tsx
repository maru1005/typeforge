// app/lgoin/page.tsx
// ログインページ

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  loginSchema,
  LoginSchema,
  signUpSchema,
  SignUpSchema,
} from "@/lib/schemas";
import { createClient } from "@/lib/api/supabase/client";

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
    <div>
      {isSignUp ? (
        <form onSubmit={signUpForm.handleSubmit(onSignUp)}>
          <input
            {...signUpForm.register("email")}
            type="email"
            placeholder="✉️メールアドレス"
          />
          <input
            {...signUpForm.register("password")}
            type="password"
            placeholder="🔑パスワード"
          />
          <input
            {...signUpForm.register("username")}
            type="text"
            placeholder="ユーザー名"
          />
          <button type="submit">アカウント作成</button>
        </form>
      ) : (
        <form onSubmit={loginForm.handleSubmit(onLogin)}>
          <input
            {...loginForm.register("email")}
            type="email"
            placeholder="✉️メールアドレス"
          />
          <input
            {...loginForm.register("password")}
            type="password"
            placeholder="🔑パスワード"
          />
          <button type="submit">ログイン</button>
        </form>
      )}
      <button onClick={() => setIsSignUp((v) => !v)}>
        {isSignUp ? "ログインはこちら" : "新規登録はこちら"}
      </button>
    </div>
  );
}
