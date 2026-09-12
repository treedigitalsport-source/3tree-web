import { aiArticles, neilArticles } from "@/lib/articlesData";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import ArticleReaderClient from "@/components/features/ArticleReaderClient";

export function generateStaticParams() {
  const allArticles = [...aiArticles, ...neilArticles];
  return [
    ...allArticles.map((article) => ({ slug: article.slug })),
    ...allArticles.map((article) => ({ slug: String(article.id) })),
  ];
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase().trim();

  // Robust finder matching slug, decoded slug, ID, or legacy aliases
  const allArticles = [...aiArticles, ...neilArticles];
  const article = allArticles.find((a) => {
    const aSlug = a.slug.toLowerCase().trim();
    const aId = String(a.id);
    return (
      aSlug === rawSlug.toLowerCase().trim() ||
      aSlug === decodedSlug ||
      aId === rawSlug ||
      aId === decodedSlug ||
      (decodedSlug === "revolucion-ia-big-data" && aSlug === "el-partido-invisible-big-data-ia") ||
      (decodedSlug.includes("china") && aSlug.includes("china")) ||
      (decodedSlug.includes("diamante") && aSlug.includes("diamante")) ||
      (decodedSlug.includes("epidemia") && aSlug.includes("epidemia")) ||
      (decodedSlug.includes("ucl") && aSlug.includes("ucl")) ||
      (decodedSlug.includes("matriz") && aSlug.includes("matriz")) ||
      (decodedSlug.includes("viaje") && aSlug.includes("viaje"))
    );
  });

  if (!article) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <h1 className="text-4xl font-display font-black">Article Not Found</h1>
        <Link href="/journal" className="ml-4 text-brandOrange underline">Go Back</Link>
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <ArticleReaderClient article={article} />
    </>
  );
}
