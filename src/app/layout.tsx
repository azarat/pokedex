import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Покедекс Рандомайзер — Семейная Игра!",
  description:
    "Футуристический покемон-рандомайзер с весёлыми заданиями для детей и родителей. Лови покемонов, выполняй задания, зарабатывай XP!",
  keywords: ["покемон", "покедекс", "рандомайзер", "дети", "семья", "игра"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
