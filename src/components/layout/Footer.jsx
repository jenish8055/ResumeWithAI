import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white flex items-center justify-center shadow-brand">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-neutral-900 dark:text-white font-heading">
                Resume<span className="text-brand-500">withAI</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              Build a Resume That Gets Noticed. Create professional, ATS-friendly resumes, CVs, and biodatas with role-adaptive AI assistance.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Guaranteed: Your data stays locally on your device.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Features
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li><Link to="/dashboard" className="hover:text-brand-500">Resume Builder</Link></li>
              <li><Link to="/templates" className="hover:text-brand-500">10+ ATS Templates</Link></li>
              <li><Link to="/ai-tools" className="hover:text-brand-500">AI ATS Matcher</Link></li>
              <li><Link to="/cover-letter" className="hover:text-brand-500">Cover Letter AI</Link></li>
              <li><Link to="/biodata" className="hover:text-brand-500">Biodata Creator</Link></li>
            </ul>
          </div>

          {/* Privacy & System */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Data & Settings
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li><Link to="/settings" className="hover:text-brand-500">Privacy Center</Link></li>
              <li><Link to="/settings" className="hover:text-brand-500">Export / Backup Data</Link></li>
              <li><Link to="/settings" className="hover:text-brand-500">Activity Logs</Link></li>
              <li><Link to="/career-coach" className="hover:text-brand-500">AI Career Coach</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} ResumewithAI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for job seekers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
