import './globals.css';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import AuthenticatorLayout from './authenticatorLayout';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import ConfigureAmplifyClientSide from '@/lib/utils/configure-amplify';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amplify Blog',
  description: 'A blog powered by AWS Amplify, Next.js, Tailwind CSS, and TypeScript',
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
              <AuthenticatorLayout>
                <ConfigureAmplifyClientSide />
                <div className="min-h-screen flex flex-col">
                  <NavBar />
                  <div className="flex-1">
                    {children}
                  </div>
                </div>
              </AuthenticatorLayout>
            </QueryProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
