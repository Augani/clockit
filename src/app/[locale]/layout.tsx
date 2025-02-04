import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ThemeProvider from "@/components/ThemeProvider";
import "@/app/globals.css";
import { Providers } from "@/components/Providers";
type Params = Promise<{ locale: string }>;
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Params;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale – if invalid, show a 404 page.
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Get localized messages by passing the locale.
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="h-full">
      <body className="h-full overflow-x-hidden">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>{children}</ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
