import type { Lang } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";
import { getPageByKey, pickLang } from "@/lib/content";
import Blocks from "@/components/Blocks";
import { prisma } from "@/lib/prisma";

<<<<<<< Updated upstream
type Params = Promise<{ lang: Lang }>;
=======
type Params = Promise<{ lang: string }>;
>>>>>>> Stashed changes

export async function generateMetadata({
  params,
}: {
  params: Params;
}) {
<<<<<<< Updated upstream
  const { lang } = await params;
=======
  const { lang: langParam } = await params;
  const lang = (locales as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : defaultLocale;
>>>>>>> Stashed changes

  const page = await getPageByKey("about");
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const title =
    lang === "ru"
      ? page?.metaTitleRu || page?.titleRu
      : page?.metaTitleEn || page?.titleEn;

  const desc =
    lang === "ru"
      ? page?.metaDescRu || settings?.defaultMetaDescriptionRu
      : page?.metaDescEn || settings?.defaultMetaDescriptionEn;

  const base = process.env.AUTH_URL || "https://siteemploymentltd1-production.up.railway.app";

  return {
    title: title || settings?.brandName,
    description: desc || undefined,
    alternates: {
      canonical: `${base}/${lang}/about`,
      languages: {
        ru: `${base}/ru/about`,
        en: `${base}/en/about`,
      },
    },
  };
}

export default async function About({
  params,
}: {
  params: Params;
}) {
<<<<<<< Updated upstream
  const { lang } = await params;
=======
  const { lang: langParam } = await params;
  const lang = (locales as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : defaultLocale;
>>>>>>> Stashed changes

  const page = await getPageByKey("about");
  const blocks = pickLang<any>(lang, page?.blocksJson);

  return <Blocks blocks={blocks} lang={lang} />;
}
