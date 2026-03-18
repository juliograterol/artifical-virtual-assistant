import "./globals.css";
import type { Metadata } from "next";
import Background from "@/component/bg";
import { Montserrat } from "next/font/google";
import Sidebar from "@/component/sidebar/sidebar";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ava from InteractiveWorkers",
  description:
    "Artificial Virtual Assistant: InteractiveWorkers' AI Agent created by @juliograterol. Resourceful, and highly capable professional AI with deep expertise spanning business development, marketing, recruitment, and content strategy. With the precision of a specialist and the versatility of InteractiveWorkers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <Background />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
