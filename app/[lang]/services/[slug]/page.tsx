import type { Lang } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import Blocks from "@/components/Blocks";
import { notFound } from "next/navigation";

type Params = Promise<{ lang: string; slug: string }>;

<<<<<<< Updated upstream
function normalizeLang(value: string): Lang {
  return (locales as readonly string[]).includes(value) ? (value as Lang) : defaultLocale;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);

  // У модели Service один slug (общий для обоих языков)
  const service = await prisma.service.findUnique({
    where: { slug },
  });
=======
export async function generateMetadata({
  params,
}: {
  params: Params;
}) {
  const { lang: langParam, slug } = await params;
  const lang = (locales as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : defaultLocale;

  // Ищем услугу по slug в нужном языке
  const service = await prisma.service.findUnique({ where: { slug } });
>>>>>>> Stashed changes

  if (!service || !service.isPublished) return {};

  const base = process.env.AUTH_URL || "https://siteemploymentltd1-production.up.railway.app/";

  const title =
    lang === "ru"
      ? service.metaTitleRu || service.titleRu
      : service.metaTitleEn || service.titleEn;

  const desc =
    lang === "ru"
      ? service.metaDescRu || service.excerptRu
      : service.metaDescEn || service.excerptEn;

  return {
    title,
    description: desc || undefined,
    alternates: {
<<<<<<< Updated upstream
      canonical: `${base}/${lang}/services/${service.slug}`,
      languages: {
        ru: `${base}/ru/services/${service.slug}`,
        en: `${base}/en/services/${service.slug}`,
=======
      canonical: `${base}/${lang}/services/${slug}`,
      languages: {
        ru: `${base}/ru/services/${lang === "ru" ? slug : service.slug}`,
        en: `${base}/en/services/${lang === "en" ? slug : service.slug}`,
>>>>>>> Stashed changes
      },
    },
    openGraph: {
      title,
      description: desc || undefined,
<<<<<<< Updated upstream
      url: `${base}/${lang}/services/${service.slug}`,
=======
      url: `${base}/${lang}/services/${slug}`,
>>>>>>> Stashed changes
      type: "website",
      images: service.ogImageUrl ? [service.ogImageUrl] : undefined,
    },
  };
}

<<<<<<< Updated upstream
export default async function ServicePage({ params }: { params: Params }) {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);

  const service = await prisma.service.findUnique({
    where: { slug },
  });
=======
export default async function ServicePage({
  params,
}: {
  params: Params;
}) {
  const { lang: langParam, slug } = await params;
  const lang = (locales as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : defaultLocale;

  const service = await prisma.service.findUnique({ where: { slug } });
>>>>>>> Stashed changes

  if (!service || !service.isPublished) return notFound();

  const blocks = lang === "ru" ? service.contentRu : service.contentEn;

  return <Blocks blocks={blocks} lang={lang} />;
}
