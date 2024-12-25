import { Switch, Route, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Vault } from "@/pages/Vault";
import { Projects } from "@/pages/Projects";
import { LandingPage } from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar-provider";
import { DynamicContextProvider, useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function App() {
  const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;

  if (!environmentId) {
    console.error("Missing Dynamic environment ID");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-muted-foreground">
            Dynamic SDK configuration is missing. Please check your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <AuthenticatedApp />
    </DynamicContextProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useDynamicContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

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
        <Route path="/dashboard/*">
          {isAuthenticated ? (
            <SidebarProvider>
              <Layout>
                <Switch>
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/dashboard/vault" component={Vault} />
                  <Route path="/dashboard/projects" component={Projects} />
                </Switch>
              </Layout>
            </SidebarProvider>
          ) : (
            <ConnectWallet />
          )}
        </Route>
      </Switch>
      <Toaster />
    </>
  );
}

function ConnectWallet() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-muted-foreground mb-6">
          Connect your wallet to access the platform
        </p>
        <DynamicWidget />
      </div>
    </div>
  );
}

export default App;