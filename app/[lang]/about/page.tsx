import type { Lang } from "@/lib/i18n";
import { getPageByKey, pickLang } from "@/lib/content";
import Blocks from "@/components/Blocks";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { lang: Lang } }) {
  const page = await getPageByKey("about");
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const title = params.lang === "ru" ? (page?.metaTitleRu || page?.titleRu) : (page?.metaTitleEn || page?.titleEn);
  const desc = params.lang === "ru" ? (page?.metaDescRu || settings?.defaultMetaDescriptionRu) : (page?.metaDescEn || settings?.defaultMetaDescriptionEn);
  const base = process.env.AUTH_URL || "http://localhost:3000";

  return {
    title: title || settings?.brandName,
    description: desc || undefined,
    alternates: {
      canonical: `${base}/${params.lang}/about`,
      languages: {
        ru: `${base}/ru/about`,
        en: `${base}/en/about`,
      },
    },
  };
}

export default async function About({ params }: { params: { lang: Lang } }) {
  const page = await getPageByKey("about");
  const blocks = pickLang<any[]>(params.lang, page?.blocksJson);
  return <Blocks blocks={blocks} lang={params.lang} />;
}
