import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Stats as StatsType } from "@/types/api";

export function Stats() {
  const { data: stats } = useQuery<StatsType>({
    queryKey: ["/api/stats"]
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalDeposits ?? 0} ETH</div>
          <p className="text-xs text-muted-foreground">
            +{stats?.depositGrowth.toFixed(2) ?? 0}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeProjects ?? 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.completedProjects ?? 0} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interest Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalInterest.toFixed(4) ?? 0} ETH</div>
          <p className="text-xs text-muted-foreground">
            {stats?.interestRate ?? 0}% APY
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aid Distributed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalDistributed ?? 0} ETH</div>
          <p className="text-xs text-muted-foreground">
            Across {stats?.beneficiaries ?? 0} beneficiaries
          </p>
        </CardContent>
      </Card>
    </div>
  );
}