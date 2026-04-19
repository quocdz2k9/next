import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop Acc Game Giá Rẻ Uy Tín Chất Lựợng",
  description: "Shop Acc Game Giá Rẻ Uy Tín Chất Lựợng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        {/* Nội dung trang web */}
        {children}

        {/* Cấu hình thông báo Sonner */}
        <Toaster 
          position="top-right" 
          richColors 
          expand={false} 
          closeButton 
        />
      </body>
    </html>
  );
}
