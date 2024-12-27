import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { initWeb3, getAccount } from "@/lib/web3";
import { ExecutionVault } from "@/lib/morpho";
import { ethers } from "ethers";
import type { VaultDeposit, Stats } from "@/types/api";

export function Vault() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const { data: deposits } = useQuery<VaultDeposit[]>({
    queryKey: ["/api/deposits"]
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"]
  });

  const handleDeposit = async () => {
    try {
      setIsDepositing(true);
      const web3 = await initWeb3();
      const account = await getAccount();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new ExecutionVault(provider);

      const tx = await vault.deposit(depositAmount);

      // Add deposit to database
      await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account,
          amount: depositAmount,
          txHash: tx.transactionHash
        })
      });

      toast({
        title: "Deposit successful",
        description: `Deposited ${depositAmount} ETH into the vault`
      });

      setDepositAmount("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: error.message
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      const web3 = await initWeb3();
      const account = await getAccount();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new ExecutionVault(provider);

      const tx = await vault.withdraw(withdrawAmount);

      toast({
        title: "Withdrawal successful",
        description: `Withdrawn ${withdrawAmount} ETH from the vault`
      });

      setWithdrawAmount("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: error.message
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Morpho Vault</h1>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Deposit ETH to generate interest for humanitarian aid. Your principal remains secure while interest is used for projects.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount in ETH"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleDeposit}
                disabled={!depositAmount || isDepositing}
              >
                {isDepositing ? "Depositing..." : "Deposit ETH"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount in ETH"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || isWithdrawing}
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw ETH"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vault Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Deposits</p>
              <p className="text-2xl font-bold">{stats?.totalDeposits ?? 0} ETH</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current APY</p>
              <p className="text-2xl font-bold">{stats?.interestRate ?? 0}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interest Generated</p>
              <p className="text-2xl font-bold">{stats?.totalInterest?.toFixed(4) ?? 0} ETH</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}