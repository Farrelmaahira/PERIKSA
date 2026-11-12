import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import type React from "react";
import Footer from "@/components/organisms/Footer";
import SiteLayout from "@/components/organisms/SiteLayout";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TITLE,
} from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE_THEME_COLOR,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Suspense>
          <SiteLayout footer={<Footer />}>{children}</SiteLayout>
        </Suspense>
      </body>
    </html>
  );
}
