import type { Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: { lang: Lang } }) {
  const base = process.env.AUTH_URL || "http://localhost:3000";
  return {
    title: params.lang === "ru" ? "Услуги" : "Services",
    alternates: {
      canonical: `${base}/${params.lang}/services`,
      languages: {
        ru: `${base}/ru/services`,
        en: `${base}/en/services`,
      },
    },
  };
}

export default async function Services({ params }: { params: { lang: Lang } }) {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{t(params.lang, "Услуги", "Services")}</h1>
        <p className="mt-2 text-slate-600">{t(params.lang, "6 направлений поддержки как в референсе.", "Six support directions as in the reference.")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-semibold">{params.lang === "ru" ? s.titleRu : s.titleEn}</div>
            <div className="mt-2 text-sm text-slate-600">{params.lang === "ru" ? s.excerptRu : s.excerptEn}</div>
            <Link
              href={`/${params.lang}/services/${s.slug}`}
              className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {t(params.lang, "Подробнее", "Details")}
            </Link>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border bg-slate-50 px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold md:text-xl">{t(params.lang, "Выбрать менеджера", "Choose a manager")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t(params.lang, "Выберите удобный контакт и получите консультацию.", "Pick a contact channel and get a consultation.")}</p>
          </div>
          <Link href={`/${params.lang}/contact`} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">
            {t(params.lang, "Перейти", "Open")}
          </Link>
        </div>
      </section>
    </div>
  );
}
