import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  expanded?: boolean;
}

export function Sidebar({ expanded = true, className, children, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "h-screen transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}