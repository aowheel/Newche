import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "@/ui/global.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://newche.vercel.app"),
  title: "Newche",
  description: "Newche is an app that makes it easy to share SCI Cycle-ball Team schedule."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}
