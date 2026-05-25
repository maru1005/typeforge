// app/lgoin/page.tsx
// ログインページ

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/lib/schemas";
import { createClient } from "@/lib/api/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email")}
          type="email"
          placeholder="メールアドレス"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="パスワード"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}
