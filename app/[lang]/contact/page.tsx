import type { Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { t } from "@/lib/i18n";
import { normalizeWhatsApp, normalizeTelegram, normalizeInstagram } from "@/lib/contacts";

function ManagerCard({ m, lang }: { m: any; lang: Lang }) {
  const name = lang === "ru" ? m.nameRu : m.nameEn;
  const role = lang === "ru" ? m.roleRu : m.roleEn;

  const links = {
    whatsapp: normalizeWhatsApp(m.whatsapp),
    telegram: normalizeTelegram(m.telegram),
    instagram: normalizeInstagram(m.instagram),
    email: m.email ? `mailto:${m.email}` : null,
  };

  const order = ["whatsapp", "telegram", "instagram", "email"] as const;

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-slate-100">
        {m.photoUrl ? <img src={m.photoUrl} alt={name} className="h-full w-full object-cover" /> : null}
      </div>

      <div className="text-base font-semibold">{name}</div>
      {role ? <div className="mt-1 text-sm text-slate-600">{role}</div> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {order.map((k) => {
          const href = links[k];
          if (!href) return null;
          return (
            <a
              key={k}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border px-3 py-2 text-xs font-medium"
            >
              {k}
            </a>
          );
        })}
      </div>
    </div>
  );
}

type Params = Promise<{ lang: Lang }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}) {
  const { lang } = await params;

  // дальше твой текущий код меты
}

export default async function Contact({
  params,
}: {
  params: Params;
}) {
  const { lang } = await params;

  // дальше твой текущий код страницы, просто используй переменную lang
}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{t(params.lang, "Выбор менеджера", "Choose a manager")}</h1>
        <p className="mt-2 text-slate-600">
          {t(params.lang, "Нажмите на нужный контакт — показываются только заполненные.", "Tap a contact method — only filled ones are shown.")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {managers.map((m) => (
          <ManagerCard key={m.id} m={m} lang={params.lang} />
        ))}
      </div>
    </div>
  );
}
