import type { Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import Blocks from "@/components/Blocks";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { lang: Lang; slug: string } }) {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  const base = process.env.AUTH_URL || "http://localhost:3000";

  if (!s || !s.isPublished) return {};
  const title = params.lang === "ru" ? (s.metaTitleRu || s.titleRu) : (s.metaTitleEn || s.titleEn);
  const desc = params.lang === "ru" ? (s.metaDescRu || s.excerptRu) : (s.metaDescEn || s.excerptEn);

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${base}/${params.lang}/services/${params.slug}`,
      languages: {
        ru: `${base}/ru/services/${params.slug}`,
        en: `${base}/en/services/${params.slug}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `${base}/${params.lang}/services/${params.slug}`,
      images: s.ogImageUrl ? [s.ogImageUrl] : undefined,
      type: "article",
    },
  };
}

export default async function ServicePage({ params }: { params: { lang: Lang; slug: string } }) {
  const s = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!s || !s.isPublished) return notFound();
  const blocks = params.lang === "ru" ? s.contentRu : s.contentEn;
  return <Blocks blocks={blocks} lang={params.lang} />;
}
