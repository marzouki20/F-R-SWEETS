import { Link } from "@tanstack/react-router";
import uploadedLogo from "@/assets/logo/logo (1).jpg";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="F&R Sweets — accueil" className={cn("inline-flex items-center", className)}>
      <img src={uploadedLogo} alt="F&R Sweets Café-Pâtisserie" className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14" width={512} height={512} />
    </Link>
  );
}

export function LogoBadge({ className }: { className?: string }) {
  return (
    <img
      src={uploadedLogo}
      alt="F&R Sweets Café-Pâtisserie"
      className={cn("rounded-full", className)}
      width={512}
      height={512}
      loading="lazy"
    />
  );
}
