import { supabase } from "./supabase";

export async function loadUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(1)
    .maybeSingle();
  console.log("USER DATA:", data);
  console.log("USER ERROR:", error);
  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
