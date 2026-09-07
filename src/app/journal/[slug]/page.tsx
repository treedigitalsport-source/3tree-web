import { aiArticles, neilArticles } from "@/lib/articlesData";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import ArticleReaderClient from "@/components/features/ArticleReaderClient";

export function generateStaticParams() {
  const allArticles = [...aiArticles, ...neilArticles];
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Find article in either array by slug, id, or legacy alias
  const article = [...aiArticles, ...neilArticles].find((a) => 
    a.slug === resolvedParams.slug || 
    String(a.id) === resolvedParams.slug ||
    (resolvedParams.slug === "revolucion-ia-big-data" && a.slug === "el-partido-invisible-big-data-ia")
  );

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
