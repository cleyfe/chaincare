import { Switch, Route } from "wouter";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Vault } from "@/pages/Vault";
import { Projects } from "@/pages/Projects";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar-provider";

function App() {
  return (
    <SidebarProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/vault" component={Vault} />
          <Route path="/projects" component={Projects} />
        </Switch>
      </Layout>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;