import './globals.css';
import '@/styles/markdown.css';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import { MobileDock } from '@/components/MobileDock';
import AuthenticatorProvider from '@/lib/providers/authenticator-provider';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import ConfigureAmplifyClientSide from '@/lib/utils/configure-amplify';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SSR Blog',
  description: 'A blog template with CMS and SSR powered by AWS Amplify, Next.js, Tailwind CSS, and TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <QueryProvider>
              <AuthenticatorProvider>
                <ConfigureAmplifyClientSide />
                <div className="min-h-screen flex flex-col relative">
                  <NavBar />
                  <div className="flex-1 px-4 md:px-8">
                    {children}
                  </div>
                  <Footer />
                  <MobileDock />
                </div>
              </AuthenticatorProvider>
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </body>
    </html>
  );
}
