import { Oswald } from "next/font/google";
const oswald = Oswald({ subsets: ["latin"], weight: "500" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={oswald.className}>{children}</body>
    </html>
  );
}