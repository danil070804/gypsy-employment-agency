import type { Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: { lang: Lang } }) {
  const base = process.env.AUTH_URL || "http://localhost:3000";
  return {
    title: params.lang === "ru" ? "Блог" : "Blog",
    alternates: {
      canonical: `${base}/${params.lang}/blog`,
      languages: {
        ru: `${base}/ru/blog`,
        en: `${base}/en/blog`,
      },
    },
  };
}

export default async function Blog({ params, searchParams }: { params: { lang: Lang }, searchParams: { page?: string } }) {
  const page = Math.max(1, Number(searchParams.page || "1"));
  const pageSize = 9;

  const where = { isPublished: true } as const;
  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{t(params.lang, "Блог", "Blog")}</h1>
        <p className="mt-2 text-slate-600">{t(params.lang, "Новости и полезные материалы.", "Updates and helpful materials.")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((p) => {
          const slug = params.lang === "ru" ? p.slugRu : p.slugEn;
          const title = params.lang === "ru" ? p.titleRu : p.titleEn;
          const excerpt = params.lang === "ru" ? p.excerptRu : p.excerptEn;
          return (
            <Link key={p.id} href={`/${params.lang}/blog/${slug}`} className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-2 text-sm text-slate-600">{excerpt}</div>
              {p.publishedAt ? <div className="mt-3 text-xs text-slate-500">{new Date(p.publishedAt).toLocaleDateString()}</div> : null}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={`/${params.lang}/blog?page=${Math.max(1, page - 1)}`}
          className={page <= 1 ? "pointer-events-none opacity-40" : "underline"}
        >
          {t(params.lang, "Назад", "Back")}
        </Link>
        <div className="text-slate-600">
          {page} / {totalPages}
        </div>
        <Link
          href={`/${params.lang}/blog?page=${Math.min(totalPages, page + 1)}`}
          className={page >= totalPages ? "pointer-events-none opacity-40" : "underline"}
        >
          {t(params.lang, "Далее", "Next")}
        </Link>
      </div>
    </div>
  );
}
