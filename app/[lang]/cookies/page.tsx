import type { Lang } from "@/lib/i18n";
import { getPageByKey, pickLang } from "@/lib/content";
import Blocks from "@/components/Blocks";

export default async function Cookies({ params }: { params: { lang: Lang } }) {
  const page = await getPageByKey("cookies");
  const blocks = pickLang<any[]>(params.lang, page?.blocksJson);
  return <Blocks blocks={blocks} lang={params.lang} />;
}
