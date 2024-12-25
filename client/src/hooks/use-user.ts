import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

type User = {
  id: string;
  address: string;
  chain: string;
  connected: boolean;
} | null;

export function useUser(): { user: User; isLoading: boolean; error: null } {
  const {
    isAuthenticated,
    isLoading,
    primaryWallet,
  } = useDynamicContext();

  return {
    user: isAuthenticated ? {
      id: primaryWallet?.address || '',
      address: primaryWallet?.address,
      chain: primaryWallet?.chain,
      connected: isAuthenticated,
    } : null,
    isLoading,
    error: null,
  };
}