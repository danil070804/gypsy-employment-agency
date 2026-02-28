import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Lang } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import type { ReactNode } from "react";

/**
 * Next.js 15's generated LayoutProps for dynamic segments currently types
 * params as Promise<{ [key: string]: string }>.
 * Keep this layout compatible and validate/cast at runtime.
 */
type Params = Promise<{ lang: string }>;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { lang } = await params;

  const safeLang: Lang = (locales as readonly string[]).includes(lang)
    ? (lang as Lang)
    : locales[0];

  return (
    <>
      <Header lang={safeLang} />
      <main className="container py-10">{children}</main>
      <Footer lang={safeLang} />
    </>
  );
}
