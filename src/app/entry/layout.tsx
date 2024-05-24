import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEWCHE",
  description: "日程調整アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${notoSansJP.className} h-full bg-black`}>{children}</body>
    </html>
  );
}
