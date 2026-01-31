import QueryProvider from "@/providers/QueryProvider";
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/shared/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Geny StuntCare - AI-Powered Child Health Monitoring",
    template: "%s | Geny StuntCare",
  },
  description:
    "Sistem digital berbasis AI untuk deteksi dini, pencegahan, dan penanganan risiko stunting dengan rekomendasi personal, monitoring tumbuh kembang anak, dan edukasi kesehatan ibu dan anak.",
  keywords: [
    "stunting",
    "kesehatan anak",
    "monitoring anak",
    "cegah stunting",
    "AI kesehatan",
    "posyandu digital",
    "kesehatan ibu dan anak",
    "tumbuh kembang",
  ],
  authors: [{ name: "Geny StuntCare Team" }],
  creator: "Geny StuntCare",
  publisher: "Geny StuntCare",
  metadataBase: new URL("https://genystuntcare.cloud"),
  openGraph: {
    title: "Geny StuntCare - AI-Powered Child Health Monitoring",
    description:
      "Sistem digital berbasis AI untuk deteksi dini dan pencegahan stunting. Pantau tumbuh kembang anak Anda dengan rekomendasi personal.",
    url: "https://genystuntcare.cloud",
    siteName: "Geny StuntCare",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/og-image.png", // Assuming we will have an OG image later, or use one of the generated ones if preferred
        width: 1200,
        height: 630,
        alt: "Geny StuntCare Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geny StuntCare",
    description:
      "Cegah Stunting, Wujudkan Generasi Sehat dengan AI-Powered Monitoring.",
    images: ["/assets/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
