import type { Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import Blocks from "@/components/Blocks";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { lang: Lang; slug: string } }) {
  const p = await prisma.blogPost.findFirst({
    where: params.lang === "ru" ? { slugRu: params.slug } : { slugEn: params.slug },
  });
  const base = process.env.AUTH_URL || "http://localhost:3000";

  if (!p || !p.isPublished) return {};
  const title = params.lang === "ru" ? (p.metaTitleRu || p.titleRu) : (p.metaTitleEn || p.titleEn);
  const desc = params.lang === "ru" ? (p.metaDescRu || p.excerptRu) : (p.metaDescEn || p.excerptEn);

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${base}/${params.lang}/blog/${params.slug}`,
      languages: {
        ru: `${base}/ru/blog/${params.lang === "ru" ? params.slug : p.slugRu}`,
        en: `${base}/en/blog/${params.lang === "en" ? params.slug : p.slugEn}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `${base}/${params.lang}/blog/${params.slug}`,
      images: (p.ogImageUrl || p.coverImageUrl) ? [p.ogImageUrl || p.coverImageUrl!] : undefined,
      type: "article",
    },
  };
}

export default async function Post({ params }: { params: { lang: Lang; slug: string } }) {
  const p = await prisma.blogPost.findFirst({
    where: params.lang === "ru" ? { slugRu: params.slug } : { slugEn: params.slug },
  });

  if (!p || !p.isPublished) return notFound();

  const title = params.lang === "ru" ? p.titleRu : p.titleEn;
  const blocks = params.lang === "ru" ? p.contentRu : p.contentEn;

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {p.publishedAt ? <div className="text-sm text-slate-500">{new Date(p.publishedAt).toLocaleDateString()}</div> : null}
      </header>
      <Blocks blocks={blocks} lang={params.lang} />
    </article>
  );
}
