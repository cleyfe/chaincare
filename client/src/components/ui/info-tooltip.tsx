import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  term: string;
  description: string;
  link: string;
  children?: React.ReactNode;
}

export function InfoTooltip({
  term,
  description,
  link,
  children,
}: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help inline-flex items-center">
          {children || term}
          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <p>{description}</p>
          <Link href={link}>
            <span className="text-primary hover:underline text-sm block mt-1">
              Learn more →
            </span>
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
