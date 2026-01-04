import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { EstablishmentProvider } from "@/contexts/EstablishmentContext";
import { StudentProvider } from "@/contexts/StudentContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "APE Connect",
    template: "%s | APE Connect",
  },
  description: "Parent-school communication platform for absence management and textbook marketplace",
  manifest: "/manifest.json",
  keywords: ["school", "parent", "communication", "absence", "textbook", "marketplace"],
  authors: [{ name: "APE Connect" }],
  openGraph: {
    title: "APE Connect",
    description: "Parent-school communication platform for absence management and textbook marketplace",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "APE Connect",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F3E7" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>
          <EstablishmentProvider>
            <StudentProvider>
              {children}
              <Toaster position="top-right" richColors />
            </StudentProvider>
          </EstablishmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
