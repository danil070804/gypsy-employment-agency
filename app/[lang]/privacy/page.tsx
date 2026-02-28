import type { Lang } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";
import { getPageByKey, pickLang } from "@/lib/content";
import Blocks from "@/components/Blocks";

<<<<<<< Updated upstream
type Params = Promise<{ lang: Lang }>;
=======
type Params = Promise<{ lang: string }>;
>>>>>>> Stashed changes

export default async function Privacy({
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

  const page = await getPageByKey("privacy");
  const blocks = pickLang<any>(lang, page?.blocksJson);

  return <Blocks blocks={blocks} lang={lang} />;
}
