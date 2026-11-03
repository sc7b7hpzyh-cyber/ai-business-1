import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nüdling AI | Hospitality Operations",
  description: "An intelligent operations workspace for hospitality teams."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
