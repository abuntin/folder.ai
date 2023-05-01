import './global.css';
import { App } from 'components/app';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: 'FolderAI',
    template: '%s | FolderAI',
  },
  description: 'AI-powered document management.',
  openGraph: {
    title: 'FolderAI',
    description: 'AI-powered document management.',
    url: 'https://folder.ai',
    siteName: 'FolderAI',
    images: [
      {
        url: '/logo_transparent.svg',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-GB',
    type: 'website',
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
  // twitter: {
  //   title: 'Lee Robinson',
  //   card: 'summary_large_image',
  // },
  icons: {
    shortcut: '/favicon.ico',
  },
  // verification: {
  //   google: 'eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw',
  //   yandex: '14d2e73487fa6c71',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <App>{children}</App>
    </html>
  );
}
