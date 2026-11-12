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
    default: `${DATA.name} – ${DATA.title}`,
    template: `%s | ${DATA.name}`,
  },

  description: DATA.description,

  keywords: [
    "Generative AI Engineer",
    "Full-Stack AI Engineer",
    "AI Engineer",
    "Python",
    "FastAPI",
    "Generative AI",
    "RAG",
    "LangChain",
    "Software Engineer",
    "Full Stack Developer",
    "Java Spring Boot",
    "Next.js",
    "TypeScript",
    DATA.name,
  ],

  authors: [{ name: DATA.name }],
  creator: DATA.name,

  openGraph: {
    title: `${DATA.name} – ${DATA.title}`,
    description: DATA.description,
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${DATA.name} – ${DATA.title}`,
    description: DATA.description,
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
        suppressHydrationWarning
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
