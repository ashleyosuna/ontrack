import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "OnTrack Reminder App Prototype",
  description: "TaskApp conversion with Next.js, Tailwind, and Capacitor",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
