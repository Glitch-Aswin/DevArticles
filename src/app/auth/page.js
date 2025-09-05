"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (isSignUp) {
      // ---- SIGN UP FLOW ----
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const { user } = data;
      if (user) {
        // Insert into your custom users table
        await supabase.from("users").insert([
          { id: user.id, email: user.email, name },
        ]);
      }
      router.push("/dashboard");
    } else {
      // ---- SIGN IN FLOW ----
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Floating geometric shapes with blur animation */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-neutral-200/30 dark:border-neutral-700/30 rotate-45 rounded-lg animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-neutral-300/20 dark:border-neutral-600/20 rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-neutral-100/40 dark:bg-neutral-800/20 rotate-12 rounded animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-neutral-200/30 dark:border-neutral-700/30 rotate-[30deg] rounded-lg animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-neutral-300/15 dark:border-neutral-600/15 rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-neutral-200/20 dark:bg-neutral-700/15 rotate-45 animate-pulse" style={{ animationDuration: '3s' }}></div>
        
        {/* Blurry gradient blobs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/20 to-cyan-100/20 dark:from-emerald-900/10 dark:to-cyan-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      {/* Subtle overlay */}
      <div className="fixed inset-0 bg-neutral-50/60 dark:bg-neutral-900/60 backdrop-blur-[0.5px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center px-6 sm:px-20 py-8 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
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
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl rounded-3xl p-8 border border-neutral-200/40 dark:border-neutral-700/40 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 tracking-tight">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {isSignUp ? "Join the developer community" : "Sign in to your account"}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{errorMsg}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-700/60 border border-neutral-200/60 dark:border-neutral-600/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-700/60 border border-neutral-200/60 dark:border-neutral-600/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-neutral-700/60 border border-neutral-200/60 dark:border-neutral-600/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold py-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900 rounded-full animate-spin"></div>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            {/* Switch Mode */}
            <div className="text-center mt-8 pt-6 border-t border-neutral-200/40 dark:border-neutral-700/40">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg("");
                  }}
                  className="text-neutral-900 dark:text-neutral-100 font-semibold hover:underline transition-all duration-300"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="text-center mt-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}