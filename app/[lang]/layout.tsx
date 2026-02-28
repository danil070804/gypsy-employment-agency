import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Lang } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  return (
    <>
      <Header lang={params.lang} />
      <main className="container py-10">{children}</main>
      {/* @ts-expect-error Async Server Component */}
      <Footer lang={params.lang} />
    </>
  );
}
