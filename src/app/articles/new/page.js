"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data: tags } = await supabase
      .from("tags")
      .select("id, name")
      .order("name");
    if (tags) setAvailableTags(tags);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;
    
    const { data, error } = await supabase
      .from("tags")
      .insert({ name: newTag.trim() })
      .select()
      .single();
    
    if (!error && data) {
      setAvailableTags([...availableTags, data]);
      setSelectedTags([...selectedTags, data]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError("You must be signed in to create an article.");
        return;
      }

      // Create article
      const { data: article, error: articleError } = await supabase
        .from("articles")
        .insert({
          title,
          content,
          slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          author_id: user.id,
        })
        .select()
        .single();

      if (articleError) {
        setError(articleError.message);
        return;
      }

      // Add article-tag relationships
      if (selectedTags.length > 0) {
        const tagRelations = selectedTags.map(tag => ({
          article_id: article.id,
          tag_id: tag.id
        }));

        const { error: tagError } = await supabase
          .from("article_tags")
          .insert(tagRelations);

        if (tagError) {
          console.error("Tag relation error:", tagError);
        }
      }

      setSuccess("Article created successfully!");
      setTitle("");
      setContent("");
      setSelectedTags([]);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
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
            Browse Articles
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative px-6 sm:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
                Create New Article
              </span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Share your knowledge and insights with the developer community. Write about what you've learned, built, or discovered.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8 sm:p-12 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a compelling title for your article..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-neutral-400 dark:placeholder-neutral-500"
                />
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Tags
                </label>
                
                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag.id)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Available Tags */}
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Select from existing tags:</p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags
                      .filter(tag => !selectedTags.find(st => st.id === tag.id))
                      .map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagSelect(tag)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors duration-200 border border-neutral-200 dark:border-neutral-700"
                        >
                          {tag.name}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Create New Tag */}
                <div className="space-y-3">
                  {!showTagInput ? (
                    <button
                      type="button"
                      onClick={() => setShowTagInput(true)}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create new tag
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New tag name"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                      />
                      <button
                        type="button"
                        onClick={handleCreateTag}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowTagInput(false); setNewTag(""); }}
                        className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Textarea */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Article Content
                </label>
                <textarea
                  placeholder="Write your article content here. Share your insights, tutorials, or experiences..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={16}
                  className="w-full px-4 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base placeholder-neutral-400 dark:placeholder-neutral-500 resize-y font-mono leading-relaxed"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Tip: Use markdown for formatting (headings, code blocks, lists, etc.)
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Link
                  href="/articles"
                  className="px-8 py-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    "Publish Article"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}