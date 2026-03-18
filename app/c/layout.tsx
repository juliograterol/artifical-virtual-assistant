import Sidebar from "@/component/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Ava",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
