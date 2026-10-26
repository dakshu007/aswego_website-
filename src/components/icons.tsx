import {
  Aperture,
  Bike,
  Camera,
  Clapperboard,
  Flag,
  Heart,
  Megaphone,
  MessageCircle,
  Route,
  type LucideProps,
} from "lucide-react";

/** Lucide dropped brand marks, so this redraws its Instagram glyph on the same 24px / 2px-stroke grid. */
export function InstagramIcon(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export const iconMap = {
  flag: Flag,
  bike: Bike,
  camera: Camera,
  clapperboard: Clapperboard,
  megaphone: Megaphone,
  heart: Heart,
  message: MessageCircle,
  route: Route,
  aperture: Aperture,
} as const;
