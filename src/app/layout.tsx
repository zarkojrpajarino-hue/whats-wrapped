import type { Metadata } from "next";
import "./globals.css";
import { WrappedProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "WhatsWrapped - Tu Spotify Wrapped de WhatsApp",
  description: "Descubre la historia de tus conversaciones de WhatsApp. Privado, bonito, emocional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black font-sans">
        <WrappedProvider>{children}</WrappedProvider>
      </body>
    </html>
  );
}
