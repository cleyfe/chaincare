import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, TrendingUp, Users, DollarSign, Coins, Trophy, ShieldCheck, Lock, Eye, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { initWeb3, getAccount } from "@/lib/web3";
import { MorphoVault } from "@/lib/morpho";
import { ethers } from "ethers";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface RewardsData {
  points: string;
  level: string;
  history: Array<{
    amount: string;
    reason: string;
    timestamp: string;
  }>;
}

interface Stats {
  totalDeposits: number;
  depositGrowth: number;
  activeProjects: number;
  completedProjects: number;
  totalInterest: number;
  interestRate: number;
  totalDistributed: number;
  beneficiaries: number;
}

const ETH_TO_USD = 2000; // Fixed conversion rate for demonstration

export function Dashboard() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [estimatedImpact, setEstimatedImpact] = useState<number>(0);
  const [simulatedReturn, setSimulatedReturn] = useState<number>(0);
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();

  const { data: stats, isLoading: isStatsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"]
  });

  const { data: userRewards } = useQuery<RewardsData>({
    queryKey: [primaryWallet?.address ? `/api/rewards/${primaryWallet.address}` : null],
    enabled: !!primaryWallet?.address,
    initialData: {
      points: "0",
      level: "Bronze",
      history: []
    }
  });

  const formatUSD = (ethAmount: number) => {
    const usdAmount = ethAmount * ETH_TO_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(usdAmount);
  };

  const handleDeposit = async () => {
    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "Wallet not found",
        description: "Please install a Web3 wallet like MetaMask"
      });
      return;
    }

    try {
      setIsDepositing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new MorphoVault(provider);
      const tx = await vault.deposit(depositAmount);

      await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: primaryWallet?.address,
          amount: depositAmount,
          txHash: tx.hash
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

  const handleWithdraw = async () => {
    if (!window.ethereum || !withdrawAmount) {
      return;
    }

    try {
      setIsWithdrawing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new MorphoVault(provider);
      const tx = await vault.withdraw(withdrawAmount);

      toast({
        title: "Withdrawal successful",
        description: `Withdrawn ${formatUSD(parseFloat(withdrawAmount))} from the humanitarian fund`
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

  const simulateImpact = async () => {
    if (!depositAmount) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new MorphoVault(provider);
      const apy = await vault.getAPY();

      // Calculate yearly return (50% of APY)
      const yearlyReturn = parseFloat(depositAmount) * (apy / 100) * 0.5;
      setSimulatedReturn(yearlyReturn);

      // Calculate humanitarian impact (50% of APY)
      const yearlyImpact = yearlyReturn; // Same as return since it's split 50/50
      setEstimatedImpact(yearlyImpact);
    } catch (error) {
      console.error("Error calculating impact:", error);
      setEstimatedImpact(0);
      setSimulatedReturn(0);
    }
  };

  useEffect(() => {
    const calculateImpact = async () => {
      if (!depositAmount) {
        setEstimatedImpact(0);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const vault = new MorphoVault(provider);
        const apy = await vault.getAPY();
        const yearlyReturn = parseFloat(depositAmount) * (apy / 100);
        setEstimatedImpact(yearlyReturn);
      } catch (error) {
        console.error("Error calculating impact:", error);
        setEstimatedImpact(0);
      }
    };

    calculateImpact();
  }, [depositAmount]);


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

      {/* Updated Deposit Section */}
      <Card className="bg-gradient-to-br from-background to-muted/50">
        <CardHeader>
          <CardTitle>Make a Secure Deposit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Trust Badges */}
            <div className="flex gap-4 items-center justify-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <InfoTooltip
                  term="Non-Custodial"
                  description="You maintain full control of your funds at all times. We never take possession of your assets."
                  link="/faq#non-custodial"
                />
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <InfoTooltip
                  term="Smart Contract Security"
                  description="Your funds are secured by audited smart contracts on the blockchain."
                  link="/faq#smart-contracts"
                />
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <InfoTooltip
                  term="DeFi Transparency"
                  description="All transactions and fund movements are publicly verifiable on the blockchain."
                  link="/faq#defi"
                />
              </div>
            </div>

            {/* Deposit Input and Impact Calculator */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Deposit Amount</h3>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    placeholder="Amount in USD"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button
                    variant="secondary"
                    onClick={simulateImpact}
                    disabled={!depositAmount}
                  >
                    Simulate Impact
                  </Button>
                </div>
                <div className="flex space-x-4 mt-4">
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
                        Secure Deposit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Estimated Humanitarian Impact</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Your Annual Return</p>
                      <p className="text-2xl font-bold text-primary">
                        ${simulatedReturn.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yearly Impact</p>
                      <p className="text-2xl font-bold text-primary">
                        ${estimatedImpact.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works with tooltips */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">How It Works</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Your deposit is securely held in a{' '}
                  <InfoTooltip
                    term="non-custodial smart contract"
                    description="A secure, automated program that holds your funds while maintaining your full control."
                    link="/faq#smart-contracts"
                  />
                </li>
                <li>2. Funds generate yield through established{' '}
                  <InfoTooltip
                    term="DeFi lending protocols"
                    description="Decentralized platforms that facilitate lending and borrowing of digital assets to generate returns."
                    link="/faq#lending-protocols"
                  />
                </li>
                <li>3. Generated returns are automatically directed to verified humanitarian projects</li>
                <li>4. Withdraw your initial deposit at any time, while the returns create lasting impact</li>
              </ol>
            </div>

            {/* Withdraw Section */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Withdraw Funds</h3>
              <div className="flex space-x-4">
                <Input
                  type="number"
                  placeholder="Amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button
                  variant="outline"
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || isWithdrawing}
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Your deposit remains under your control and can be withdrawn at any time. Only the generated returns are used for humanitarian aid.
              </p>
            </div>
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