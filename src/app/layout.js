import './globals.css';

export const metadata = {
  title: 'Reunion Finance',
  description: 'Financial Dashboard for Reunion',
  manifest: '/manifest.json', // Must match public/manifest.json path
  themeColor: '#2563eb',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0', // Prevents zoom on mobile inputs
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