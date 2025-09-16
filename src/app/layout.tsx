import type { Metadata } from "next";
import { Sora, Anton } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sports Training Hub",
  description: "A comprehensive platform for coaches and athletes to collaborate, track progress, and achieve peak performance through structured training programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${anton.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
