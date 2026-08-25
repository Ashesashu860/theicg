import { redirect } from "next/navigation";
import { AppToaster } from "@/components/app-toaster";
import { PortalSidebar } from "@/components/portal-sidebar";
import { getAdminSession } from "@/lib/admin-session";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-off-white text-on-surface">
      <PortalSidebar />
      <main className="flex min-h-screen w-full flex-1 flex-col pt-20 md:ml-64">
        {children}
      </main>
      <AppToaster />
    </div>
  );
}
