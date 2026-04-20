import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";
import { PrismaClient } from "@prisma/client";

// Đưa ra ngoài để dùng chung kết nối (Singleton)
const prisma = new PrismaClient();

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop Acc Game Giá Rẻ Uy Tín Chất Lượng",
  description: "Shop Acc Game Giá Rẻ Uy Tín Chất Lượng",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lấy dữ liệu ngay tại Server - HTML đổ xuống sẽ có sẵn chữ luôn
  const settings = await prisma.setting.findFirst();

  const footerData = {
    logoUrl: settings?.logoUrl || "",
    footerLines: settings?.footerLines || []
  };

  return (
    <html lang="vi" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable)}>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        
        {/* Truyền data đã lấy từ server xuống */}
        <Footer initialData={footerData} />

        <Toaster position="top-right" richColors expand={false} closeButton />
      </body>
    </html>
  );
}

