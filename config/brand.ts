/**
 * BRAND CONFIGURATION
 * ---------------------------------------------------------------------------
 * Every user-facing string, color, and asset reference for the brand lives
 * here. Renaming the startup later = editing this file only. Nothing else
 * in the codebase should hardcode the brand name, tagline, or palette.
 */

export const brand = {
  name: "Project Connect",
  shortName: "Connect",
  domain: "projectconnect.in",
  tagline: "Where student founders find their team",
  description:
    "India's platform for student founders, co-founders and early startup teams — share ideas, find teammates, and build together.",

  // Used for the logo mark when no image asset is supplied.
  logoInitial: "C",

  colors: {
    light: {
      background: "#F7F8FB",
      surface: "#FFFFFF",
      ink: "#12141C",
      inkMuted: "#565A6E",
      border: "#E4E6F0",
      primary: "#5B4CFF", // campus-ink violet
      primaryInk: "#FFFFFF",
      accent: "#F5A623", // turmeric — CTAs, energy
      accentInk: "#12141C",
      success: "#1E9E6B",
      danger: "#E5484D",
    },
    dark: {
      background: "#0D0E1A",
      surface: "#151726",
      ink: "#F4F5FA",
      inkMuted: "#9195AD",
      border: "#262A40",
      primary: "#7C6CFF",
      primaryInk: "#0D0E1A",
      accent: "#FFC04D",
      accentInk: "#12141C",
      success: "#39C98E",
      danger: "#FF6B6F",
    },
  },

  fonts: {
    display: "var(--font-display)", // Space Grotesk
    body: "var(--font-body)", // Inter
    mono: "var(--font-mono)", // IBM Plex Mono
  },

  metadata: {
    title: "Project Connect — Where student founders find their team",
    ogImage: "/og-image.png",
    twitterHandle: "@projectconnect",
    themeColor: "#5B4CFF",
  },

  social: {
    twitter: "https://twitter.com/projectconnect",
    instagram: "https://instagram.com/projectconnect",
    linkedin: "https://linkedin.com/company/projectconnect",
  },

  contact: {
    email: "myprojectconnect6@gmail.com",
  },
} as const;

export type Brand = typeof brand;
