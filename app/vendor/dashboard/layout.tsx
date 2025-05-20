import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/lib/context/sidebar-context";
import { tryCatch } from "@/lib/utils";
import { getUserStore } from "@/lib/queries/store/vendors";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Icons from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
 
  const { data, error } = await tryCatch(getUserStore());

  if (error) {
    return (
      <Alert variant="destructive">
        <Icons.AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load Store. try again later
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Suspense fallback={<div>loading...</div>}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-100">
          <div className="max-sm:hidden">
            <Sidebar store={data} />
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
