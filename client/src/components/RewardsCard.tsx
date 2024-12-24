import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAccount } from "@/lib/web3";
import { useEffect, useState } from "react";

interface RewardsData {
  points: string;
  level: string;
  history: Array<{
    amount: string;
    reason: string;
    timestamp: string;
  }>;
}

export function RewardsCard() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await getAccount();
      setAccountId(account);
    };
    fetchAccount();
  }, []);

  const { data: rewards } = useQuery<RewardsData>({
    queryKey: [accountId ? `/api/rewards/${accountId}` : null],
    enabled: !!accountId,
    initialData: {
      points: "0",
      level: "Bronze",
      history: []
    }
  });

  const levelColors = {
    Bronze: "text-orange-600 bg-orange-100",
    Silver: "text-gray-600 bg-gray-100",
    Gold: "text-yellow-600 bg-yellow-100",
    Platinum: "text-purple-600 bg-purple-100"
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Impact Rewards</CardTitle>
          <Badge className={levelColors[rewards.level as keyof typeof levelColors]}>
            {rewards.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-2xl font-bold">{parseInt(rewards.points).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Recent Activity</p>
            <div className="space-y-2">
              {rewards.history.length > 0 ? (
                rewards.history.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.reason}</span>
                    <span className="font-medium">+{parseInt(item.amount).toLocaleString()} pts</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity yet. Make your first investment to earn points!
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}