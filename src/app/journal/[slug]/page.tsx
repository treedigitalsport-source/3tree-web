"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aiArticles, neilArticles } from "@/lib/articlesData";
import CustomCursor from "@/components/CustomCursor";

export default function ArticleReader({ params }: { params: { slug: string } }) {
  // Find article in either array
  const article = [...aiArticles, ...neilArticles].find((a) => a.slug === params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <h1 className="text-4xl font-display font-black">Article Not Found</h1>
        <Link href="/journal" className="ml-4 text-brandOrange underline">Go Back</Link>
      </div>
    );
  }

  // Very basic markdown parser for the article content
  const renderContent = (content: string) => {
    return content.split('\\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl md:text-6xl font-display font-black text-white mt-16 mb-8 leading-tight">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl md:text-3xl font-display font-bold text-white mt-12 mb-6 text-brandOrange">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-brandOrange pl-6 italic text-white/70 my-10 text-xl font-serif">{line.replace('> ', '')}</blockquote>;
      }
      if (line.trim() === '') return <br key={index} />;
      return <p key={index} className="text-white/60 text-lg md:text-xl leading-relaxed mb-6 font-medium">{line}</p>;
    });
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-brandOrange selection:text-white relative overflow-x-hidden">
      <CustomCursor />

      {/* Navigation */}
      <nav className="absolute top-0 w-full px-6 md:px-12 py-8 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/journal" className="hoverable flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-300 backdrop-blur-md bg-white/5">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Back to Journal</span>
        </Link>
      </nav>

      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16 z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6 flex-wrap"
            >
              <span className="px-4 py-2 rounded-full bg-brandOrange text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_#f26522]">
                {article.category}
              </span>
              <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest border border-white/10">
                <Clock className="w-3 h-3" />
                {article.time}
              </div>
              {/* @ts-ignore */}
              {article.author && (
                <div className="flex items-center gap-2 text-white bg-[#0054a6] px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {/* @ts-ignore */}
                  By {article.author}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-12 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {renderContent(article.content)}
        </motion.div>
      </article>

      {/* Footer Divider */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 border-t border-white/10 pt-12 pb-24 text-center">
        <p className="font-mono text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
          3Tree Digital Sport Tech © 2026
        </p>
      </div>
    </main>
  );
}
