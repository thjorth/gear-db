import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gear DB",
  description: "Track and insure your music gear with confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
