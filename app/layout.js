// app/layout.js
import Providers from "@/components/Providers";

export const metadata = {
  title: "Sales Command Center",
  description: "Real-time AE & SDR performance dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
