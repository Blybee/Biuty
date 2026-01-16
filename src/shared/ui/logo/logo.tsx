import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/shared/lib";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
}

export function Logo({
  className,
  size = "md",
  showText = true,
  href = "/",
}: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-base" },
    md: { container: "w-10 h-10", icon: "w-5 h-5", text: "text-xl" },
    lg: { container: "w-12 h-12", icon: "w-6 h-6", text: "text-2xl" },
  };

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full bg-primary flex items-center justify-center",
          sizes[size].container
        )}
      >
        <Leaf className={cn("text-white", sizes[size].icon)} />
      </div>
      {showText && (
        <span className={cn("font-bold text-forest", sizes[size].text)}>
          Biuty
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
