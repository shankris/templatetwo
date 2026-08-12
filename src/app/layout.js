// src/app/layout.js

import { Inter } from "next/font/google";
// import "./globals.css";

import "../styles/reset.css";
import "../styles/variables.css";
import "../styles/generic.css";

import DevicePreview from "@/components/UI/DevicePreview/DevicePreview";

const inter = Inter({
  variable: "--font-inter",
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
      className={inter.variable}
    >
      <body>{children}</body>
    </html>
  );
}
