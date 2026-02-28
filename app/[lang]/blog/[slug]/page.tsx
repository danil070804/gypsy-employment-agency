import type { Lang } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import Blocks from "@/components/Blocks";
import { notFound } from "next/navigation";

<<<<<<< Updated upstream
type Params = Promise<{ lang: Lang; slug: string }>;
=======
type Params = Promise<{ lang: string; slug: string }>;
>>>>>>> Stashed changes

export async function generateMetadata({
  params,
}: {
  params: Params;
}) {
<<<<<<< Updated upstream
  const { lang, slug } = await params;
=======
  const { lang: langParam, slug } = await params;
  const lang = (locales as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : defaultLocale;
>>>>>>> Stashed changes

  const post = await prisma.blogPost.findFirst({
    where:
      lang === "ru"
        ? { slugRu: slug }
        : { slugEn: slug },
  });

  if (!post || !post.isPublished) return {};

  const base = process.env.AUTH_URL || "https://siteemploymentltd1-production.up.railway.app";

  const title = lang === "ru" ? post.metaTitleRu || post.titleRu : post.metaTitleEn || post.titleEn;
  const desc = lang === "ru" ? post.metaDescRu || post.excerptRu : post.metaDescEn || post.excerptEn;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${base}/${lang}/blog/${slug}`,
    },
  };
}

export default async function Post({
  params,
}: {
  params: Params;
}) {
<<<<<<< Updated upstream
  const { lang, slug } = await params;
=======
  const { lang: langParam, slug } = await params;
  const lang = (locales as readonly string[]).includes(langParam)
    ? (langParam as Lang)
    : defaultLocale;
>>>>>>> Stashed changes

  const post = await prisma.blogPost.findFirst({
    where:
      lang === "ru"
        ? { slugRu: slug }
        : { slugEn: slug },
  });

  if (!post || !post.isPublished) return notFound();

  const blocks = lang === "ru" ? post.contentRu : post.contentEn;

  return <Blocks blocks={blocks} lang={lang} />;
}
