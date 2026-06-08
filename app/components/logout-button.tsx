// app/components/logout-button.tsx

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/api/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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
