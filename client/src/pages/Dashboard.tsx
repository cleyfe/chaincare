import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, TrendingUp, Users, DollarSign, Coins, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";
import type { Stats } from "@/types/api";
import { initWeb3, getAccount } from "@/lib/web3";
import { MorphoVault } from "@/lib/morpho";
import { ethers } from "ethers";

const ETH_TO_USD = 2000; // Fixed conversion rate for demonstration

export function Dashboard() {
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  const { data: stats, isLoading: isStatsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"]
  });

  const { data: userRewards } = useQuery({
    queryKey: [primaryWallet?.address ? `/api/rewards/${primaryWallet.address}` : null],
    enabled: !!primaryWallet?.address
  });

  const formatUSD = (ethAmount: number) => {
    const usdAmount = ethAmount * ETH_TO_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(usdAmount);
  };

  const handleDeposit = async () => {
    try {
      setIsDepositing(true);
      const web3 = await initWeb3();
      const account = await getAccount();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new MorphoVault(provider);

      const tx = await vault.deposit(depositAmount);

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
        description: `Deposited ${formatUSD(parseFloat(depositAmount))} into the humanitarian fund`
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

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Humanitarian Impact Fund</h1>
        <p className="text-muted-foreground">
          Make a difference through sustainable impact investing
        </p>
      </div>

      {/* Fund Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUSD(stats?.totalDeposits || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.depositGrowth.toFixed(2)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current APY</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.interestRate}%</div>
            <p className="text-xs text-muted-foreground">
              {formatUSD(stats?.totalInterest || 0)} generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aid Distributed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUSD(stats?.totalDistributed || 0)}</div>
            <p className="text-xs text-muted-foreground">
              To {stats?.beneficiaries} beneficiaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseInt(userRewards?.points || "0").toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {userRewards?.level || "Bronze"} Level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deposit Section */}
      <Card>
        <CardHeader>
          <CardTitle>Make a Deposit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-4">
              <Input
                type="number"
                placeholder="Amount in USD"
                value={depositAmount}
                onChange={(e) => setDepositAmount((parseFloat(e.target.value) / ETH_TO_USD).toString())}
                className="max-w-[200px]"
              />
              <Button 
                onClick={handleDeposit}
                disabled={!depositAmount || isDepositing}
              >
                {isDepositing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Depositing...
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Deposit Funds
                  </>
                )}
              </Button>
            </div>
            {depositAmount && (
              <p className="text-sm text-muted-foreground">
                ≈ {formatUSD(parseFloat(depositAmount))}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Your Impact Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRewards?.history?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.reason}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">+{parseInt(item.amount).toLocaleString()} pts</p>
                </div>
              </div>
            ))}
            {(!userRewards?.history || userRewards.history.length === 0) && (
              <p className="text-muted-foreground text-center py-4">
                Make your first deposit to start your impact journey!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}