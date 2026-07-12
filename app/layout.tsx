import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";
import Footer from "./components/Footer";

// Keep in sync with THEME_STORAGE_KEY in ./components/ThemeSwitcher.tsx
const THEME_STORAGE_KEY = "focus-protocol-theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Focus Protocol",
  description: "Deep Work Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Applied before paint to avoid a flash of the wrong theme.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=window.localStorage.getItem(${JSON.stringify(
              THEME_STORAGE_KEY
            )});if(t&&t!=="default"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable}`}>
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
