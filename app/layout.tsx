import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MV Travel - Luxury Maldives Hotel Booking",
  description: "Book your dream vacation in the Maldives. Discover luxury resorts, overwater villas, and pristine beaches with our exclusive hotel booking platform.",
  keywords: ["Maldives", "hotel booking", "luxury resort", "overwater villa", "beach vacation", "travel"],
  authors: [{ name: "MV Travel" }],
  openGraph: {
    title: "MV Travel - Luxury Maldives Hotel Booking",
    description: "Book your dream vacation in the Maldives with exclusive deals on luxury resorts.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Poppins for body, STIX Two for headings */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=STIX+Two+Text:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
