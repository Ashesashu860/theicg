import { PortalSidebar } from "@/components/portal-sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-off-white text-on-surface">
      <PortalSidebar />
      <main className="flex min-h-screen w-full flex-1 flex-col pt-20 md:ml-64">
        {children}
      </main>
    </div>
  );
}
