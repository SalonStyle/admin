import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Salon Management System",
  description: "Admin panel for salon management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full overflow-hidden bg-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
