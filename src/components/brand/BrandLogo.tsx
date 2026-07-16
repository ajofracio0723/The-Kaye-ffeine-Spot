import { cn } from "@/lib/utils";

type BrandMarkSize = "sm" | "md" | "lg" | "hero";

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
  showTagline?: boolean;
  /** Light text for dark backgrounds (auth/sidebar) */
  tone?: "light" | "dark";
}

const sizeStyles: Record<
  BrandMarkSize,
  { beans: string; the: string; name: string; spot: string; tag: string; gap: string }
> = {
  sm: {
    beans: "w-3 h-3",
    the: "text-[0.55rem] tracking-[0.35em]",
    name: "text-lg leading-none",
    spot: "text-xl -mt-1",
    tag: "text-[0.45rem] tracking-[0.28em] mt-1.5",
    gap: "gap-0.5",
  },
  md: {
    beans: "w-3.5 h-3.5",
    the: "text-[0.65rem] tracking-[0.4em]",
    name: "text-2xl leading-none",
    spot: "text-2xl -mt-1",
    tag: "text-[0.5rem] tracking-[0.3em] mt-2",
    gap: "gap-1",
  },
  lg: {
    beans: "w-4 h-4",
    the: "text-xs tracking-[0.45em]",
    name: "text-4xl leading-none",
    spot: "text-3xl -mt-1",
    tag: "text-[0.55rem] tracking-[0.32em] mt-2",
    gap: "gap-1.5",
  },
  hero: {
    beans: "w-5 h-5",
    the: "text-sm tracking-[0.5em]",
    name: "text-5xl sm:text-6xl leading-none",
    spot: "text-4xl sm:text-5xl -mt-1",
    tag: "text-[0.65rem] tracking-[0.35em] mt-3",
    gap: "gap-2",
  },
};

function CoffeeBeans({ className }: { className?: string }) {
  const Bean = ({ tilt = 0, scale = 1 }: { tilt?: number; scale?: number }) => (
    <svg
      viewBox="0 0 24 32"
      className="text-current"
      style={{ width: `${0.9 * scale}em`, height: `${1.2 * scale}em`, transform: `rotate(${tilt}deg)` }}
      fill="currentColor"
      aria-hidden
    >
      <ellipse cx="12" cy="16" rx="8" ry="13" />
      <path
        d="M12 5 C10 12, 10 20, 12 27"
        fill="none"
        stroke="hsl(30 25% 12%)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );

  return (
    <div className={cn("flex items-end justify-center gap-0.5", className)} aria-hidden>
      <Bean tilt={-18} scale={0.85} />
      <Bean tilt={0} scale={1} />
      <Bean tilt={18} scale={0.85} />
    </div>
  );
}

export function BrandMark({
  size = "md",
  className,
  showTagline = true,
  tone = "dark",
}: BrandMarkProps) {
  const s = sizeStyles[size];
  const color = tone === "light" ? "text-[#c4a574]" : "text-[#9a7348]";

  return (
    <div className={cn("flex flex-col items-center text-center select-none", s.gap, color, className)}>
      <CoffeeBeans className={s.beans} />

      <div className={cn("flex items-center gap-2 font-brand-serif uppercase", s.the)}>
        <span className="block h-px w-6 sm:w-8 bg-current opacity-70" />
        <span>The</span>
        <span className="block h-px w-6 sm:w-8 bg-current opacity-70" />
      </div>

      <div className={cn("font-brand-display font-semibold tracking-tight", s.name)}>
        Kaye-ffeine
      </div>

      <div className={cn("font-brand-script italic leading-none", s.spot)}>
        Spot
      </div>

      {showTagline && (
        <div className={cn("font-brand-sans uppercase opacity-80", s.tag)}>
          Café POS Software
        </div>
      )}
    </div>
  );
}

/** @deprecated Use BrandMark — kept as alias for existing imports */
export const BrandLogo = BrandMark;
