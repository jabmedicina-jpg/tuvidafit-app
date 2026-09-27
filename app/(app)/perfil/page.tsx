import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PerfilForm from "./PerfilForm";

export default async function PerfilPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <PerfilForm userId={user.id} initialProfile={profile} />;
}
