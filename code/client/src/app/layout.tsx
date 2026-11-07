'use client';

import { Inter as FontSans } from 'next/font/google';
import { Suspense } from 'react';
import { AuthRedirect } from '../components/AuthRedirect';
import { UserProvider } from '../contexts/UserData';
import { cn } from '@/lib/utils';
import './globals.css';
import '@/app/globals.css';
import { EmbeddedComponentContext } from '../contexts/EmbeddedComponentContext';
import { TeamDataProvider } from '@/contexts/TeamData';
import { WorkshopDataProvider } from '@/contexts/WorkshopData';
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface CustomCSSProperties extends React.CSSProperties {
  '--transition-duration'?: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <HtmlPage>
        <Suspense>
          <AuthRedirect>
            <WorkshopDataProvider>
              <TeamDataProvider>
                <EmbeddedComponentContext>{children}</EmbeddedComponentContext>
              </TeamDataProvider>
            </WorkshopDataProvider>
          </AuthRedirect>
        </Suspense>
      </HtmlPage>
    </UserProvider>
  );
}

function HtmlPage({ children }: Readonly<{ children: React.ReactNode }>) {
  const containerClasses = `
    flex-grow transition-all ease-in-out

  `;

  // TODO: see effect of removing transitionDuration: 'var(--transition-duration)',
  const containerStyle: CustomCSSProperties = {
    '--transition-duration': '300ms',
  };

  return (
    <html lang="en">
      <head>
        <title>ZenFlow</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-offset font-sans antialiased',
          fontSans.variable
        )}
      >
        <div className={`flex min-h-screen flex-col`}>
          <div
            id="app-container"
            className={containerClasses}
            style={containerStyle}
          >
            <div className={`flex min-h-full flex-col`}>
              <main className="w-full flex-grow">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
