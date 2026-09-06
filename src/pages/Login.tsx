import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Origami, Bot, Sparkles, Zap, ArrowRight, ShieldCheck, Code, Cpu } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-200">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <motion.div animate={{ rotateY: 360, y: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Origami className="w-4 h-4 text-white" strokeWidth={1.5} /></motion.div>
          </div>
          <span className="text-xl font-medium tracking-tight text-slate-100">Lumina</span>
        </div>
        <button 
          onClick={signIn} 
          className="text-sm font-medium text-slate-600 hover:text-slate-50 transition-colors"
        >
          Sign in
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 md:px-12 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Introducing the new AI Assistant
          </div>
          
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-slate-50 leading-tight">
            Chat to supercharge <br className="hidden md:block"/> your ideas.
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of AI. Write, code, plan, and create with an intelligent assistant powered by Google Gemini.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={signIn} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto"
        >
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-sm shadow-black/50">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-slate-50">Advanced Intelligence</h3>
            <p className="text-slate-500 leading-relaxed">Engage in nuanced conversations, solve complex problems, and get creative inspiration instantly.</p>
          </div>
          
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-sm shadow-black/50">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-slate-50">Multi-Persona AI</h3>
            <p className="text-slate-500 leading-relaxed">Use Prism mode to analyze topics from multiple expert perspectives simultaneously for better decisions.</p>
          </div>

          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-sm shadow-black/50">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-slate-50">Secure by Design</h3>
            <p className="text-slate-500 leading-relaxed">Your data is yours. Enterprise-grade security and isolated Firebase environments protect your privacy.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-100">
        <p>Powered by Google Gemini API & Cloud Run</p>
      </footer>
    </div>
  );
}
