import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getAccount } from "@/lib/web3";

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
  const account = getAccount();
  
  const { data: rewards } = useQuery<RewardsData>({
    queryKey: [`/api/rewards/${account}`],
    enabled: !!account,
  });

  if (!rewards) return null;

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
              {rewards.history.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.reason}</span>
                  <span className="font-medium">+{parseInt(item.amount).toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
