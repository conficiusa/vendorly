import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/lib/context/sidebar-context";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession();
  return (
    <Suspense>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-100">
          <div className="max-sm:hidden">
            <Sidebar session={session!} />
          </div>
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 bg-gradient-to-br from-primary/1 to-accent/5">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Suspense>
  );
}
