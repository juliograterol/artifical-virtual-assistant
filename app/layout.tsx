import "./globals.css";
import type { Metadata } from "next";
import Background from "@/components/bg";
import { Montserrat, Geist } from "next/font/google";
import Sidebar from "@/components/sidebar/sidebar";
import AppLoader from "@/components/app-loader";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ava from InteractiveWorkers",
  description:
    "Artificial Virtual Assistant: InteractiveWorkers' AI Agent created by @juliograterol. A resourceful, and highly capable professional AI with deep expertise spanning business development, marketing, recruitment, and content strategy. With the precision of a specialist and the versatility of InteractiveWorkers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${montserrat.className} antialiased bg-[#1B1B1B] flex flex-col`}
      >
        <AppLoader>
          <Background />
          <div className="flex h-full">
            <Sidebar />
            <div className="overflow-y-scroll w-full">{children}</div>
          </div>
        </AppLoader>
      </body>
    </html>
  );
}
