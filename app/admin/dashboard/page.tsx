import { redirect } from "next/navigation";

export default function DashboardPage() {
  const eventoId = process.env.DEFAULT_EVENTO_ID || "FIBA";
  redirect(`/admin/dashboard/${eventoId}`);
}
