// Mapa de clases de color estático. IMPORTANTE: las clases tienen que estar
// escritas tal cual (no armadas con `bg-${color}`) para que Tailwind las
// detecte y las genere en el CSS final.

export type AccentColor =
  | "teal"
  | "green"
  | "orange"
  | "blue"
  | "purple"
  | "coral";

type AccentClasses = {
  text: string;
  bg: string;
  bgSofter: string; // fondo muy suave (tarjetas)
  bgSoft: string; // fondo suave (badges, chips inactivos)
  bgBadge: string; // fondo medio (badges activos sobre blanco)
  border: string;
  accent: string; // color de checkbox/radio nativo
};

export const ACCENT: Record<AccentColor, AccentClasses> = {
  teal: {
    text: "text-teal",
    bg: "bg-teal",
    bgSofter: "bg-teal/5",
    bgSoft: "bg-teal/10",
    bgBadge: "bg-teal/15",
    border: "border-teal",
    accent: "accent-teal",
  },
  green: {
    text: "text-green",
    bg: "bg-green",
    bgSofter: "bg-green/5",
    bgSoft: "bg-green/10",
    bgBadge: "bg-green/15",
    border: "border-green",
    accent: "accent-green",
  },
  orange: {
    text: "text-orange",
    bg: "bg-orange",
    bgSofter: "bg-orange/5",
    bgSoft: "bg-orange/10",
    bgBadge: "bg-orange/15",
    border: "border-orange",
    accent: "accent-orange",
  },
  blue: {
    text: "text-blue",
    bg: "bg-blue",
    bgSofter: "bg-blue/5",
    bgSoft: "bg-blue/10",
    bgBadge: "bg-blue/15",
    border: "border-blue",
    accent: "accent-blue",
  },
  purple: {
    text: "text-purple",
    bg: "bg-purple",
    bgSofter: "bg-purple/5",
    bgSoft: "bg-purple/10",
    bgBadge: "bg-purple/15",
    border: "border-purple",
    accent: "accent-purple",
  },
  coral: {
    text: "text-coral",
    bg: "bg-coral",
    bgSofter: "bg-coral/5",
    bgSoft: "bg-coral/10",
    bgBadge: "bg-coral/15",
    border: "border-coral",
    accent: "accent-coral",
  },
};
