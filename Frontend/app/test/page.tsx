"use client";

import { supabase } from "@/lib/supabase";
console.log("URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY =", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export default function TestPage() {
  const testConnection = async () => {
    const { data, error } = await supabase.from("users").select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);
  };

  return <button onClick={testConnection}>Test Supabase</button>;
}
