import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  image?: string;
  overlay?: boolean;
  alignment?: "left" | "center" | "right";
  height?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  image,
  overlay = true,
  alignment = "center",
  height = "lg",
  className,
}: HeroBannerProps) {
  const heights = {
    sm: "min-h-[400px]",
    md: "min-h-[500px]",
    lg: "min-h-[600px]",
    full: "min-h-screen",
  };

  const alignments = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        heights[height],
        className
      )}
    >
      {/* Background */}
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/60" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-white to-background-alt">
          {/* Decorative Elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 container-biuty flex flex-col py-20",
          alignments[alignment]
        )}
      >
        {subtitle && (
          <span
            className={cn(
              "inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full",
              image
                ? "bg-white/10 text-white backdrop-blur-sm"
                : "bg-sage/10 text-sage"
            )}
          >
            {subtitle}
          </span>
        )}

        <h1
          className={cn(
            "mb-6 animate-fade-in max-w-4xl",
            image ? "text-white" : "text-forest"
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "max-w-2xl mb-10 text-lg md:text-xl animate-slide-up",
              image ? "text-white/90" : "text-sage-dark"
            )}
          >
            {description}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 animate-slide-up",
              alignment === "center" && "justify-center"
            )}
          >
            {primaryAction && (
              <Button variant="primary" size="lg">
                <Link href={primaryAction.href} className="flex items-center gap-2">
                  {primaryAction.label}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </Button>
            )}

            {secondaryAction && (
              <Button
                variant={image ? "outline" : "secondary"}
                size="lg"
                className={image ? "border-white text-white hover:bg-white hover:text-forest" : ""}
              >
                <Link href={secondaryAction.href}>
                  {secondaryAction.label}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
