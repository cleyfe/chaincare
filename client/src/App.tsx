import { Switch, Route, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { LandingPage } from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar-provider";
import {
  DynamicContextProvider,
  useDynamicContext,
  DynamicWidget,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
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
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Configuration Error
          </h1>
          <p className="text-muted-foreground">
            Dynamic SDK configuration is missing. Please check your environment
            variables.
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
  const { isLoading } = useDynamicContext();
  const [location, setLocation] = useLocation();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn && location === "/") {
      setLocation("/dashboard");
    }
  }, [isLoggedIn, location, setLocation]);

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
        <Route path="/dashboard">
          {isLoggedIn ? (
            <SidebarProvider>
              <Layout>
                <Dashboard />
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