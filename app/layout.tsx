import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { CssBaseline } from "@mui/material";
import "./globals.css";
import styles from "./layout.module.css";
import { Header } from "@/components/Header";
import { ThemeClient } from "@/components/ThemeClient";

export const metadata: Metadata = {
  title: "Wger",
  description: "Wger New UI",
  icons: "/favicon.png",
};

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CssBaseline />
      <body className={(roboto.className, styles.body)}>
        <ThemeClient>
          <Header />
          <main className={styles.main}>{children}</main>
        </ThemeClient>
      </body>
    </html>
  );
}
