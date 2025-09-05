"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalComments: 0,
    thisWeekArticles: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const getUserAndArticles = async () => {
      // Get logged-in user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/auth");
        return;
      }

      // Get user data from your users table
      const { data: userData } = await supabase
        .from("users")
        .select("id, email, name, created_at")
        .eq("id", authUser.id)
        .single();

      setUser(userData || { id: authUser.id, email: authUser.email });

      // Fetch articles authored by this user with tags and analytics
      const { data: articlesData, error } = await supabase
        .from("articles")
        .select(`
          id, 
          title, 
          content,
          created_at, 
          slug,
          article_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq("author_id", authUser.id)
        .order("created_at", { ascending: false });

      if (!error && articlesData) {
        setArticles(articlesData);
        
        // Get article IDs for analytics
        const articleIds = articlesData.map(a => a.id);
        
        // Get total views for user's articles
        let totalViews = 0;
        if (articleIds.length > 0) {
          const { count: viewsCount } = await supabase
            .from("views")
            .select("id", { count: "exact" })
            .in("article_id", articleIds);
          totalViews = viewsCount || 0;
        }

        // Get total comments for user's articles
        let totalComments = 0;
        if (articleIds.length > 0) {
          const { count: commentsCount } = await supabase
            .from("comments")
            .select("id", { count: "exact" })
            .in("article_id", articleIds);
          totalComments = commentsCount || 0;
        }

        // Calculate this week's articles
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekArticles = articlesData.filter(
          article => new Date(article.created_at) > weekAgo
        ).length;

        setStats({
          totalArticles: articlesData.length,
          totalViews,
          totalComments,
          thisWeekArticles
        });
      }
      
      setLoading(false);
    };

    getUserAndArticles();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const truncateContent = (content, maxLength = 150) => {
    const cleanContent = content.replace(/[#*`]/g, '').trim();
    if (cleanContent.length <= maxLength) return cleanContent;
    return cleanContent.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-neutral-100/50 to-neutral-200/30 dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-800/30 pointer-events-none" />
        <div className="relative text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Loading your dashboard...</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Getting your articles and analytics ready</p>
        </div>
      </div>
    );
  }

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
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Write Article
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <header className="px-6 sm:px-20 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              {/* User Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Author'}! 👋
                </span>
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Here's your writing dashboard. Track your progress, manage your articles, and see how your content is performing.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalArticles}</p>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Articles</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalViews}</p>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Views</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.totalComments}</p>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Comments</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stats.thisWeekArticles}</p>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">This Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Tabs */}
        <section className="px-6 sm:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-2">
              {[
                { id: "overview", label: "📊 Overview", icon: "chart" },
                { id: "articles", label: "📝 My Articles", icon: "document" },
                { id: "analytics", label: "📈 Analytics", icon: "analytics" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Articles */}
                <div className="lg:col-span-2">
                  <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Recent Articles</h3>
                      <Link
                        href="/articles/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Article
                      </Link>
                    </div>

                    {articles.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">No articles yet</h4>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start sharing your knowledge with the community!</p>
                        <Link
                          href="/articles/new"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Write Your First Article
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {articles.slice(0, 5).map((article) => (
                          <div key={article.id} className="group p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300/50 dark:hover:border-neutral-600/50 transition-all duration-200 hover:bg-white/50 dark:hover:bg-neutral-800/50">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <Link href={`/articles/${article.slug}`}>
                                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {article.title}
                                  </h4>
                                </Link>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                                  {truncateContent(article.content)}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                  <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                  <span>•</span>
                                  <span>{calculateReadTime(article.content)} min read</span>
                                  {article.article_tags?.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{article.article_tags.length} tag{article.article_tags.length !== 1 ? 's' : ''}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                  href={`/articles/${article.slug}`}
                                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Link>
                                <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href="/articles/new"
                        className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 transition-colors group"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Write New Article</span>
                      </Link>
                      <Link
                        href="/articles"
                        className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors group"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="font-medium">Browse All Articles</span>
                      </Link>
                      <Link
                        href="/tags"
                        className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors group"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium">Browse Tags</span>
                      </Link>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Account Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Email:</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate ml-2">{user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Member since:</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "articles" && (
                            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">All Your Articles</h3>
                
                {articles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">No articles yet</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start writing to see your articles here!</p>
                    <Link
                      href="/articles/new"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Write Your First Article
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <div key={article.id} className="group p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-neutral-300/50 dark:hover:border-neutral-600/50 transition-all duration-200 hover:bg-white/50 dark:hover:bg-neutral-800/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link href={`/articles/${article.slug}`}>
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {article.title}
                              </h4>
                            </Link>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                              {truncateContent(article.content)}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                              <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <span>•</span>
                              <span>{calculateReadTime(article.content)} min read</span>
                              {article.article_tags?.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{article.article_tags.length} tag{article.article_tags.length !== 1 ? 's' : ''}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/articles/${article.slug}`}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Analytics Overview</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  This section can include detailed analytics like views per article, comments trends, popular tags, and weekly activity charts. You can use libraries like <strong>Chart.js</strong> or <strong>Recharts</strong> for visualization.
                </p>
                <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                  <span>Analytics charts will be displayed here soon.</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
