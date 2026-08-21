import { Inter, Noto_Sans_Devanagari, Noto_Sans_JP, Noto_Sans_SC, Noto_Sans_KR } from "next/font/google";

import "../styles/reset.css";
import "../styles/variables.css";
import "../styles/generic.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
});

const japanese = Noto_Sans_JP({
  variable: "--font-japanese",
  subsets: ["latin"],
});

const chinese = Noto_Sans_SC({
  variable: "--font-chinese",
  subsets: ["latin"],
});

const korean = Noto_Sans_KR({
  variable: "--font-korean",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project Template",
  description: "Reusable Next.js project template",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`
        ${inter.variable}
        ${devanagari.variable}
        ${japanese.variable}
        ${chinese.variable}
        ${korean.variable}
      `}
    >
      <body>{children}</body>
    </html>
  );
}
