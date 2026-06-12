import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BootProvider } from "@/components/system/BootGate";
import BootSequence from "@/components/system/BootSequence";
import SmoothScroll from "@/components/system/SmoothScroll";
import CustomCursor from "@/components/system/CustomCursor";
import MouseGlow from "@/components/system/MouseGlow";
import Particles from "@/components/system/Particles";
import ScrollProgress from "@/components/system/ScrollProgress";
import CommandPalette from "@/components/system/CommandPalette";
import Nav from "@/components/system/Nav";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakitha-manamperi.vercel.app"),
  title: "Sakitha Manamperi — Software Engineering Student",
  description:
    "Software Engineering student at RMIT Melbourne building modern web applications, automation tools, cloud solutions and intelligent digital experiences.",
  keywords: [
    "Sakitha Manamperi",
    "Software Engineer",
    "RMIT",
    "Melbourne",
    "Full-Stack Developer",
    "Portfolio",
  ],
  openGraph: {
    title: "Sakitha Manamperi — Developer Command Center",
    description:
      "Enter the operating system of a software engineer. Projects, skills and story — rendered as an immersive developer experience.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body className="noise">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
        >
          skip to content
        </a>
        <BootProvider>
          <BootSequence />
          <SmoothScroll />
          <MouseGlow />
          <Particles />
          <ScrollProgress />
          <Nav />
          <CommandPalette />
          {children}
          <CustomCursor />
        </BootProvider>
      </body>
    </html>
  );
}
