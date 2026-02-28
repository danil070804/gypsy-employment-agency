import type { Lang } from "@/lib/i18n";
import { getPageByKey, pickLang } from "@/lib/content";
import Blocks from "@/components/Blocks";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: { lang: Lang } }) {
  const page = await getPageByKey("home");
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const title = params.lang === "ru" ? (page?.metaTitleRu || page?.titleRu) : (page?.metaTitleEn || page?.titleEn);
  const desc = params.lang === "ru" ? (page?.metaDescRu || settings?.defaultMetaDescriptionRu) : (page?.metaDescEn || settings?.defaultMetaDescriptionEn);

  const base = process.env.AUTH_URL || "http://localhost:3000";
  return {
    title: title || settings?.brandName,
    description: desc || undefined,
    alternates: {
      canonical: `${base}/${params.lang}`,
      languages: {
        ru: `${base}/ru`,
        en: `${base}/en`,
      },
    },
    openGraph: {
      title: title || settings?.brandName,
      description: desc || undefined,
      url: `${base}/${params.lang}`,
      images: page?.ogImageUrl ? [page.ogImageUrl] : undefined,
      type: "website",
    },
  };
}

export default async function Home({ params }: { params: { lang: Lang } }) {
  const page = await getPageByKey("home");
  const blocks = pickLang<any[]>(params.lang, page?.blocksJson);

  const reviews = await prisma.review.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 6 });
  const faqs = await prisma.fAQ.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 8 });
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }], take: 6 });

  return (
    <div className="space-y-12">
      <Blocks blocks={blocks} lang={params.lang} />

      <section>
        <h2 className="text-xl font-semibold md:text-2xl">{t(params.lang, "Отзывы", "Reviews")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-semibold">{r.authorName}</div>
              <div className="mt-2 text-sm text-slate-700">{params.lang === "ru" ? r.textRu : r.textEn}</div>
              {r.rating ? <div className="mt-3 text-xs text-slate-500">Rating: {r.rating}/5</div> : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold md:text-2xl">FAQ</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="rounded-2xl border bg-white px-5 py-4">
              <summary className="cursor-pointer text-sm font-semibold">
                {params.lang === "ru" ? f.questionRu : f.questionEn}
              </summary>
              <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                {params.lang === "ru" ? f.answerRu : f.answerEn}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold md:text-2xl">{t(params.lang, "Последние статьи", "Latest articles")}</h2>
          <Link href={`/${params.lang}/blog`} className="text-sm underline">
            {t(params.lang, "Все статьи", "All posts")}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {posts.map((p) => {
            const slug = params.lang === "ru" ? p.slugRu : p.slugEn;
            const title = params.lang === "ru" ? p.titleRu : p.titleEn;
            const excerpt = params.lang === "ru" ? p.excerptRu : p.excerptEn;
            return (
              <Link key={p.id} href={`/${params.lang}/blog/${slug}`} className="rounded-2xl border bg-white p-5">
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-2 text-sm text-slate-600">{excerpt}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 px-6 py-12 text-white md:px-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">{t(params.lang, "Выбрать менеджера", "Choose a manager")}</h2>
            <p className="mt-2 text-white/80">{t(params.lang, "Нажмите и выберите удобный способ связи.", "Pick the best contact channel for you.")}</p>
          </div>
          <Link href={`/${params.lang}/contact`} className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900">
            {t(params.lang, "Перейти", "Open")}
          </Link>
        </div>
      </section>
    </div>
  );
}
