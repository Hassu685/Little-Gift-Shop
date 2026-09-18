import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AuthProvider } from "@/hooks/useAuth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | Little Gift Shop",
};

export default async function AdminLayout({ children }) {
  // Defense in depth: middleware already blocks non-admins from /admin,
  // but every server component here re-checks too.
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/403");

  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
