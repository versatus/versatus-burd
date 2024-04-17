import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BURD",
  description: "Nest for testing on BURD",
};

const GTM_ID = "GTM-WVHJ73KS";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={"dark"}>
      <head>
        <title>{String(metadata.title)}</title>
      </head>
      <body
        className={clsx(
          inter.className,
          "bg-gray-800 text-white flex flex-col h-full relative",
        )}
      >
        {children}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />
      </body>
    </html>
  );
}
