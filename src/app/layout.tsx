/* eslint-disable @typescript-eslint/no-explicit-any */
import ThemeProvider from '@/components/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
import './globals.css';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
    console.log(locale);
  // Ensure that the incoming `locale` is valid
//   if (!routing.locales.includes(locale as any)) {
//     notFound();
//   }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-background">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
