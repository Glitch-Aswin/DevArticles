import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export const revalidate = 30;

export default async function ArticlesPage() {
  let articles = [];
  let popularTags = [];

  // Fetch data with proper error handling
  try {
    const { data: articlesData, error: articlesError } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        slug,
        content,
        created_at,
        author:author_id(name),
        article_tags:article_tags(tag_id, tag:tag_id(id, name))
      `)
      .order("created_at", { ascending: false });

    if (articlesError) throw articlesError;
    articles = articlesData || [];

    const { data: tagsData, error: tagsError } = await supabase
      .from("tags")
      .select(`id, name, article_tags(count)`)
      .limit(10);

    if (tagsError) throw tagsError;
    popularTags = tagsData || [];
  } catch (err) {
    console.error("Supabase fetch error:", err.message);
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Articles
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Helper function to truncate content
  const truncateContent = (content, maxLength = 200) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white dark:text-neutral-900">
              <path d="M3 3h18v18H3zM8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-xl text-neutral-900 dark:text-neutral-100">DevArticles</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/articles/new"
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Write Article
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Header */}
        <header className="px-6 sm:px-20 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
                Discover Articles
              </span>
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Explore insights, tutorials, and knowledge shared by developers from around the world.
              Learn something new every day.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-neutral-400 dark:placeholder-neutral-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <section className="px-6 sm:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main Articles */}
              <div className="lg:col-span-3">
                {/* Articles Count */}
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {articles?.length || 0} articles found
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Sort by:</label>
                    <select className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Latest</option>
                      <option>Popular</option>
                      <option>Oldest</option>
                    </select>
                  </div>
                </div>

                {/* Articles List */}
                <div className="space-y-8">
                  {articles?.map((article) => (
                    <article
                      key={article.id}
                      className="group bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Article Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {article.author?.name ? article.author.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {article.author?.name || "Anonymous"}
                            </h3>
                            <span className="text-neutral-400 dark:text-neutral-500">•</span>
                            <time className="text-sm text-neutral-500 dark:text-neutral-400">
                              {new Date(article.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                            <span className="text-neutral-400 dark:text-neutral-500">•</span>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                              {calculateReadTime(article.content)} min read
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Article Content */}
                      <Link href={`/articles/${article.slug}`} className="block">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 line-clamp-3">
                          {truncateContent(article.content.replace(/[#*`]/g, ""))}
                        </p>
                      </Link>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {article.article_tags?.slice(0, 3).map(({ tag }) => (
                            <span
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium"
                            >
                            #{tag.name}
                            </span>
                        ))}
                        {article.article_tags?.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md text-xs font-medium">
                            +{article.article_tags.length - 3} more
                            </span>
                        )}
                        </div>

                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags?.slice(0, 12).map((tag) => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-sm font-medium"
                    >
                        #{tag.name}
                    </span>
                    ))}

                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}