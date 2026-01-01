import './globals.css';

export const metadata = {
  title: "ICT Reunion | Fund Tracker",
  description: "Track deposits, expenses and sponsors for the reunion.",
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}