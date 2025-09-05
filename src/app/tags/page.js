import { supabase } from "../../utils/supabaseClient";
import Link from "next/link";

export default async function TagsPage() {
  const { data: tags, error } = await supabase
    .from("tags")
    .select(`
      id, 
      name,
      article_tags(count)
    `)
    .order("name");

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tags</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Get article counts for each tag
  const tagsWithCounts = await Promise.all(
    tags.map(async (tag) => {
      const { count } = await supabase
        .from("article_tags")
        .select("*", { count: 'exact' })
        .eq("tag_id", tag.id);
      
      return { ...tag, articleCount: count || 0 };
    })
  );

  // Sort by article count (most popular first) then by name
  const sortedTags = tagsWithCounts.sort((a, b) => {
    if (b.articleCount !== a.articleCount) {
      return b.articleCount - a.articleCount;
    }
    return a.name.localeCompare(b.name);
  });

  // Get popular tags (with 2+ articles) and other tags
  const popularTags = sortedTags.filter(tag => tag.articleCount >= 2);
  const allTags = sortedTags;

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
            Browse Articles
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
      <main className="relative px-6 sm:px-20 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
                Explore Topics
              </span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
              Browse articles by technology, framework, or topic. Find exactly what you're looking for in our growing collection of developer content.
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {allTags.length} topics available
            </div>
          </div>

          {/* Popular Tags Section */}
          {popularTags.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Popular Topics</h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  Trending
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularTags.slice(0, 8).map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/articles?tag=${tag.name}`}
                    className="group p-6 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-300/50 dark:hover:border-neutral-700/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        #{tag.name}
                      </h3>
                      <svg className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      {tag.articleCount} article{tag.articleCount !== 1 ? 's' : ''}
                    </p>
                    <div className="mt-4 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((tag.articleCount / Math.max(...popularTags.map(t => t.articleCount))) * 100, 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Tags Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">All Topics</h2>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Alphabetical order
              </div>
            </div>
            
            {allTags.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">No tags yet</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">Tags will appear here as articles are published.</p>
                <Link
                  href="/articles/new"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Write First Article
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8">
                <div className="flex flex-wrap gap-3">
                  {allTags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/articles?tag=${tag.name}`}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                        #{tag.name}
                      </span>
                      {tag.articleCount > 0 && (
                        <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full text-xs font-medium">
                          {tag.articleCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 sm:p-12 border border-blue-200/50 dark:border-blue-800/50">
              <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">   Can't find your topic?</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
                New topics and tags are created automatically when authors publish articles. Start writing to add your expertise to our collection!
              </p>
              <Link
                href="/articles/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Write an Article
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}