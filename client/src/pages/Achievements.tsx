import { useQuery } from "@tanstack/react-query";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Target } from "lucide-react";
import type { Achievement, UserAchievement } from "@db/schema";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface AchievementWithStatus extends Achievement {
  isEarned: boolean;
  earnedAt?: string;
}

export function Achievements() {
  const { primaryWallet } = useDynamicContext();

  const { data: achievements, isLoading } = useQuery<AchievementWithStatus[]>({
    queryKey: [primaryWallet?.address ? `/api/achievements/${primaryWallet.address}` : null],
    enabled: !!primaryWallet?.address,
  });

  const earnedCount = achievements?.filter(a => a.isEarned).length ?? 0;
  const totalCount = achievements?.length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Donor Achievements</h1>
        <p className="text-muted-foreground">
          Track your impact and earn recognition for your contributions
        </p>
      </div>

      {/* Achievement Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned Badges</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedCount}</div>
            <p className="text-xs text-muted-foreground">
              out of {totalCount} total badges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Badge</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements?.find(a => !a.isEarned)?.name ?? "All Complete!"}
            </div>
            <p className="text-xs text-muted-foreground">Keep contributing!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rarity Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((earnedCount / totalCount) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Achievement completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements?.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            name={achievement.name}
            description={achievement.description}
            imageUrl={achievement.imageUrl}
            isEarned={achievement.isEarned}
            pointsRequired={Number(achievement.pointsRequired)}
            earnedAt={achievement.earnedAt}
          />
        ))}
      </div>
    </div>
  );
}
