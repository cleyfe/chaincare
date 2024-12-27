import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButton({ title, text, url = window.location.href }: ShareButtonProps) {
  const handleShare = async () => {
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        toast({
          title: "Shared successfully",
          description: "Your achievement has been shared!"
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({
            variant: "destructive",
            title: "Failed to share",
            description: "There was a problem sharing your achievement."
          });
        }
      }
    } else {
      // Fallback for desktop browsers
      const shareText = encodeURIComponent(`${title}\n\n${text}\n\n${url}`);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
      window.open(twitterUrl, '_blank');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share Achievement
    </Button>
  );
}
