"use client";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function GetStartedButton() {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center px-8 py-4 font-semibold text-neutral-900 dark:text-neutral-900 bg-white/80 hover:bg-white border border-neutral-200/60 dark:border-neutral-200/60 hover:border-neutral-300 dark:hover:border-neutral-300 rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
    >
      {session ? 'Go to Dashboard' : 'Get Started'}
    </button>
  );
}