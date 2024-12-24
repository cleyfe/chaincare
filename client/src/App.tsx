import { Switch, Route } from "wouter";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Vault } from "@/pages/Vault";
import { Projects } from "@/pages/Projects";
import { LandingPage } from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar-provider";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/dashboard">
          <DashboardLayout />
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