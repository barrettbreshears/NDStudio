import type { Metadata } from "next";
import "./globals.css";
import WeightedScroll from "@/components/WeightedScroll";

export const metadata: Metadata = {
  title: "ND Studio — A Radical New Approach To Health In America",
  description:
    "We're turning health on its head for Americans, uniting decades of science and wisdom to create a clear framework for living well.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WeightedScroll />
        {children}
      </body>
    </html>
  );
}
