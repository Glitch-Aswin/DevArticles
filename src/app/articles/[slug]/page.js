import Link from "next/link";
import { supabase } from "../../../utils/supabaseClient";

export default async function ArticleDetail({ params }) {
  // Await params before accessing its properties
  const { slug } = await params;
  
  const { data: article, error } = await supabase
    .from("articles")
    .select(`
      *,
      author:author_id (
        id,
        name,
        email
      ),
      article_tags:article_tags (
        tag:tag_id (
          id,
          name
        )
      ),
      comments:comments (
        id,
        content,
        user_id,
        created_at,
        user:user_id (
          name
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !article) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Article not found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/articles"
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all duration-200"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to calculate read time
  const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-200/30 dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-800/30 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 sm:px-20 py-6 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white dark:text-neutral-900"
            >
              <path
                d="M3 3h18v18H3zM8 8h8M8 12h8M8 16h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-bold text-xl text-neutral-900 dark:text-neutral-100">DevArticles</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/articles"
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-200"
          >
            All Articles
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-200"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <div className="px-6 sm:px-20 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-12">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                <Link href="/articles" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Articles
                </Link>
                <span>→</span>
                <span className="truncate">{article.title}</span>
              </nav>

              {/* Article Title */}
              <h1 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
                  {article.title}
                </span>
              </h1>

              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                  {article.author?.name ? article.author.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                    {article.author?.name || "Anonymous"}
                  </h3>
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
                    <time>
                      {new Date(article.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span>•</span>
                    <span>{calculateReadTime(article.content)} min read</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {article.article_tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.article_tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.name}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <article className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8 sm:p-12 shadow-lg mb-12">
              <div 
                className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-800 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-700
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
              />
            </article>

            {/* Comments Section */}
            {article.comments?.length > 0 && (
              <section className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
                  Comments ({article.comments.length})
                </h2>
                
                <div className="space-y-6">
                  {article.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-neutral-200/50 dark:border-neutral-800/50 pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {comment.user?.name || "Anonymous"}
                            </h4>
                            <span className="text-neutral-400 dark:text-neutral-500">•</span>
                            <time className="text-sm text-neutral-500 dark:text-neutral-400">
                              {new Date(comment.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                          </div>
                          
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}