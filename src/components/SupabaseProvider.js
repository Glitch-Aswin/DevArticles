// app/SupabaseProvider.js
"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabaseClient";

export default function SupabaseProvider({ children }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
