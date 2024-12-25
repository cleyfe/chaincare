import { Link, useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar-provider";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { expanded } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar expanded={expanded} className="border-r">
        <div className="p-6">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-primary cursor-pointer">HumaniChain</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Impact Investment Platform</p>
          </Link>
        </div>

        <div className="px-3 py-2">
          <nav className="space-y-1 md:space-y-2">
            <Link href="/dashboard">
              <Button
                variant={location === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className={`ml-2 ${expanded ? "block" : "hidden md:block"}`}>Dashboard</span>
              </Button>
            </Link>
          </nav>
        </div>
      </Sidebar>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex justify-end mb-6">
            <DynamicWidget variant="dropdown" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}