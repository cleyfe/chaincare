import { Switch, Route } from "wouter";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Vault } from "@/pages/Vault";
import { Projects } from "@/pages/Projects";
import { LandingPage } from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar-provider";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard">
          {user ? <DashboardLayout /> : <AuthPage />}
        </Route>
      </Switch>
      <Toaster />
    </>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider>
      <Layout>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dashboard/vault" component={Vault} />
          <Route path="/dashboard/projects" component={Projects} />
        </Switch>
      </Layout>
    </SidebarProvider>
  );
}

export default App;