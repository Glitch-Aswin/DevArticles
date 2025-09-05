import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import GetStartedButton from "@/components/GetStartedButton";

export default async function Home() {
  // Server-side fetch user
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="font-sans flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      {/* Geometric mesh background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-neutral-200/40 dark:border-neutral-700/40 rotate-45 rounded-lg"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-neutral-300/30 dark:border-neutral-600/30 rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-neutral-100/50 dark:bg-neutral-800/30 rotate-12 rounded"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-neutral-200/40 dark:border-neutral-700/40 rotate-[30deg] rounded-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-neutral-300/20 dark:border-neutral-600/20 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-neutral-200/30 dark:bg-neutral-700/20 rotate-45"></div>
      </div>

      {/* Subtle overlay */}
      <div className="fixed inset-0 bg-neutral-50/80 dark:bg-neutral-900/80 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center px-6 sm:px-20 py-8 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 shadow-sm">
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
          <span className="font-bold text-xl text-neutral-900 dark:text-neutral-100 tracking-tight">DevArticles</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 py-24 px-6 sm:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-400 bg-clip-text text-transparent">
              DevArticles
            </span>
          </h1>
          
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-4 leading-relaxed font-medium">
            Share knowledge. Discover insights. Track impact.
          </p>
          <p className="text-lg text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Where developers write, learn, and grow together.
          </p>
          
          <div className="flex justify-center items-center gap-4 flex-wrap mb-16">
            {/* Client-side Get Started Button */}
            <GetStartedButton user={user} />
            
            <Link
              href="/articles"
              className="inline-flex items-center justify-center px-8 py-4 font-semibold text-neutral-700 dark:text-neutral-300 bg-white/70 dark:bg-neutral-800/70 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Browse Articles
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { number: "10K+", label: "Articles" },
              { number: "5K+", label: "Writers" },
              { number: "50K+", label: "Readers" },
              { number: "100+", label: "Topics" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/40 dark:border-neutral-700/40 hover:border-neutral-300/60 dark:hover:border-neutral-600/60 transition-all duration-300 hover:-translate-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 px-6 sm:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
              Built for Developers
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Everything you need to share knowledge and grow your expertise.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "✍️",
                title: "Write & Share",
                description: "Craft beautiful technical content with our intuitive editor. Share your insights with a community that values quality."
              },
              {
                icon: "🏷️",
                title: "Discover by Tags",
                description: "Navigate through expertly curated content organized by technologies, frameworks, and topics that matter."
              },
              {
                icon: "📊",
                title: "Track Your Impact",
                description: "Monitor engagement, reader growth, and content performance with detailed analytics and insights."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-neutral-200/40 dark:border-neutral-700/40 hover:border-neutral-300/60 dark:hover:border-neutral-600/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 sm:px-20 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/70 to-neutral-50/70 dark:from-neutral-800/70 dark:to-neutral-900/70 backdrop-blur-sm rounded-3xl p-12 border border-neutral-200/40 dark:border-neutral-700/40 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 tracking-tight">
              Ready to Share Your Knowledge?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers who are building their reputation and helping others grow.
            </p>
            <GetStartedButton user={user} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-12 border-t border-neutral-200/40 dark:border-neutral-700/40 backdrop-blur-sm">
        <div className="px-6 sm:px-20 max-w-6xl mx-auto">
          <div className="flex justify-center gap-8 flex-wrap mb-8">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/tags", label: "Browse Tags" },
              { href: "/about", label: "About" }
            ].map((link, index) => (
              <Link 
                key={index}
                href={link.href} 
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-300 relative group"
              >
                {link.label}
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-900 dark:bg-neutral-100 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; {new Date().getFullYear()} DevArticles. Crafted with care for the developer community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}