import { Link, useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Vault, FileText, BarChart3 } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { expanded } = useSidebar();

  return (
    <div className="flex h-screen">
      <Sidebar expanded={expanded} className="w-64 border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">HumaniChain</h1>
          <p className="text-sm text-muted-foreground mt-1">Transparent Aid Platform</p>
        </div>

        <div className="px-3 py-2">
          <nav className="space-y-2">
            <Link href="/">
              <Button
                variant={location === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link href="/vault">
              <Button
                variant={location === "/vault" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Vault className="mr-2 h-4 w-4" />
                Vault
              </Button>
            </Link>

            <Link href="/projects">
              <Button
                variant={location === "/projects" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </Link>

            <Link href="/audit">
              <Button
                variant={location === "/audit" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Audit Trail
              </Button>
            </Link>
          </nav>
        </div>
      </Sidebar>

      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
}