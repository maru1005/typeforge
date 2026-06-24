// app/components/logout-button.tsx
// ログアウトボタン

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/api/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("ログアウトに失敗しました")
      return;
    }
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-slate-400 hover:text-slate-600"
    >
      Logout
    </button>
  );
}
