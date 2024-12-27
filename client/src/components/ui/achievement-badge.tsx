import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";

interface AchievementBadgeProps {
  name: string;
  description: string;
  imageUrl: string;
  isEarned: boolean;
  pointsRequired: number;
  earnedAt?: string;
}

export function AchievementBadge({
  name,
  description,
  imageUrl,
  isEarned,
  pointsRequired,
  earnedAt,
}: AchievementBadgeProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300",
      isEarned ? "bg-primary/5" : "bg-muted/50 opacity-75"
    )}>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "rounded-full p-3",
            isEarned ? "bg-primary/10" : "bg-muted"
          )}>
            {isEarned ? (
              <Trophy className="h-6 w-6 text-primary" />
            ) : (
              <Lock className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Badge variant={isEarned ? "default" : "secondary"}>
            {pointsRequired} points required
          </Badge>
          {isEarned && earnedAt && (
            <span className="text-xs text-muted-foreground">
              Earned on {new Date(earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        {isEarned && (
          <div className="mt-4">
            <ShareButton
              title={`I earned the ${name} badge on ChainCare! 🏆`}
              text={`I just earned the ${name} badge for ${description.toLowerCase()}. Join me in making a difference through sustainable impact investing!`}
            />
          </div>
        )}
      </div>
    </Card>
  );
}