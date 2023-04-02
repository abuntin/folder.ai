import "./global.css";
import clsx from "clsx";
import localFont from "next/font/local";
import App from "./app";
import { Metadata } from "next";

const kaisei = localFont({
  src: "../public/fonts/kaisei-tokumin-latin-700-normal.woff2",
  weight: "700",
  variable: "--font-kaisei",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Folder.AI",
    template: "%s | Folder.AI",
  },
  description: "AI-powered document management.",
  openGraph: {
    title: "Folder.AI",
    description: "AI-powered document management.",
    url: "https://folder.ai",
    siteName: "Folder.AI",
    images: [
      {
        url: "/logo_transparent.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-GB",
    type: "website",
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
  // icons: {
  //   shortcut: '/favicon.ico',
  // },
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
  // return (
  //   <html
  //     lang="en"
  //     // style={{
  //     //   backgroundImage: bgDark,
  //     //   backgroundPosition: 'center',
  //     //   backgroundSize: 'cover',
  //     //   width: '100%',
  //     //   height: '100%'
  //     // }}
  //     // className={clsx(
  //     //   'text-black bg-white dark:text-white dark:bg-[#111010]',
  //     //   kaisei.variable
  //     // )}
  //   >
  //     {/* <body className="antialiased max-w-10xl mb-40 flex flex-col md:flex-row mx-auto mt-0 md:mt-0 lg:mt-12 lg:mx-10"> */}
  //       <App>
  //         {children}
  //       </App>
  //     {/* </body> */}
  //   </html>
  // );

  return <App>{children}</App>;
}
