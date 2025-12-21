import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // ✅ prevents CLS
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),

  title: {
    default: `${DATA.name} – Software Engineer`,
    template: `%s | ${DATA.name}`,
  },

  description: DATA.description,

  keywords: [
    "Software Engineer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Full Stack Developer",
    "Web Developer India",
    DATA.name,
  ],

  authors: [{ name: DATA.name }],
  creator: DATA.name,

  openGraph: {
    title: `${DATA.name} – Software Engineer`,
    description: DATA.description,
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${DATA.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${DATA.name} – Software Engineer Portfolio`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${DATA.name} – Software Engineer`,
    description: DATA.description,
    images: [`${DATA.url}/og-image.png`],
    creator: "@sarthaksarangi_",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider delayDuration={0}>
            {children}
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
