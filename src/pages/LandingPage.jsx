import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { TEMPLATES } from '../features/resume/resumeTemplates';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Zap,
  FileCheck,
  Layers,
  Wand2,
  Star,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Briefcase,
  GraduationCap,
  Target,
  FileText,
  Check,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Popular', 'ATS Focused', 'Tech & Engineering', 'Corporate', 'Creative', 'Entry Level', 'Biodata'];

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory || (selectedCategory === 'Popular' && t.tag === 'Recommended'));

  const faqs = [
    {
      q: 'Will ResumewithAI invent fake experience or metrics?',
      a: 'Never. Unlike generic chatbots, ResumewithAI strictly preserves the genuine facts, dates, and titles you provide. It specializes in improving grammar, phrasing, ATS keywords, and active verb structures without fabricating companies or degrees.',
    },
    {
      q: 'Is my personal data sent to external servers or sold to recruiters?',
      a: 'No. ResumewithAI is architected as a local-first platform. All your resume drafts, versions, and activity logs are stored directly inside your browser database (IndexedDB). Your information never leaves your device.',
    },
    {
      q: 'Can I export both PDF and Word (.docx) formats?',
      a: 'Yes! You can instantly download publication-grade A4 PDFs with vector-crisp typography, fully formatted Microsoft Word (.docx) documents, or print directly using clean print layouts.',
    },
    {
      q: 'How does the ATS Checker score my resume?',
      a: 'The ATS Checker scans your content against industry-standard screening algorithms (used by Workday, Greenhouse, Taleo) and compares your resume against target job descriptions to highlight matched keywords, missing skills, and structural readability.',
    },
    {
      q: 'Does it work for students and freshers without work experience?',
      a: 'Yes! ResumewithAI includes a dedicated Beginner & Fresher Mode that emphasizes academic degrees, projects, coursework, leadership, and technical skills rather than requiring corporate work history.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-neutral-100 dark:border-neutral-900 bg-gradient-to-b from-orange-50/40 via-white to-white dark:from-neutral-900/40 dark:via-neutral-950 dark:to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Next-Gen AI Career Assistant & ATS Resume Builder</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-neutral-900 dark:text-white leading-[1.12]">
                Build a Resume That <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Gets Noticed.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Create a professional, ATS-friendly resume with AI-powered writing assistance — even if you don't know what to write. Designed for students, freshers, developers, and experienced professionals.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Sparkles}
                  iconRight={ArrowRight}
                  onClick={() => navigate('/create')}
                  className="w-full sm:w-auto shadow-brand text-base"
                >
                  Create My Resume
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/templates')}
                  className="w-full sm:w-auto text-base"
                >
                  Explore 10+ Templates
                </Button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> 100% Free & Local-First
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" /> Instant PDF & Word Export
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" /> 99% ATS Pass Rate
                </span>
              </div>
            </div>

            {/* Right Column: Animated Interactive Resume Showcase with Floating Badges */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Background ambient glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-400/20 via-orange-300/10 to-amber-400/20 rounded-3xl blur-2xl -z-10" />

              <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
                {/* Mock Header */}
                <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-neutral-800 dark:bg-white rounded font-bold" />
                    <div className="h-2.5 w-24 bg-brand-500 rounded" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                    AM
                  </div>
                </div>

                {/* Mock Content Lines */}
                <div className="space-y-2">
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
                  <div className="h-2 w-4/5 bg-neutral-100 dark:bg-neutral-800 rounded" />
                  <div className="h-2 w-5/6 bg-neutral-100 dark:bg-neutral-800 rounded" />
                </div>

                {/* Mock Experience */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-28 bg-neutral-700 dark:bg-neutral-300 rounded font-bold" />
                    <div className="h-2.5 w-16 bg-neutral-300 dark:bg-neutral-700 rounded" />
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
                  <div className="h-2 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded" />
                </div>

                {/* Floating AI Badges */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: [0, -6, 0], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -top-4 -left-4 bg-white dark:bg-neutral-800 px-3.5 py-2 rounded-2xl shadow-xl border border-orange-200 dark:border-brand-800 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    ✨ AI Improved Summary
                  </span>
                </motion.div>

                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: [0, 6, 0], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -bottom-4 -right-4 bg-white dark:bg-neutral-800 px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    ATS Score: 94 / 100
                  </span>
                </motion.div>

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: [0, 4, 0], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-1/2 -right-6 bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 text-[11px] font-bold text-neutral-700 dark:text-neutral-200 hidden sm:flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>Resume 92% Complete</span>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION: BEFORE VS AFTER */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
              You provide the raw story. <br />
              <span className="text-brand-500">ResumewithAI</span> makes it recruiter-ready.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Never get stuck staring at an empty text box. Turn casual bullets into punchy, metric-oriented professional accomplishment statements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-neutral-400" />
                <span>Ordinary Resume Input</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 italic leading-relaxed space-y-2">
                <p>"I made websites using React and fixed bugs."</p>
                <p>"Helped with customer support emails."</p>
                <p>"Did marketing campaigns on social media."</p>
              </div>
              <p className="text-xs text-neutral-400">
                Lacks action verbs, key technical keywords, and clarity for automated ATS scanners.
              </p>
            </div>

            {/* After Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-orange-50/70 to-white dark:from-neutral-900 dark:to-neutral-900 border border-orange-200 dark:border-brand-800 shadow-brand space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>ResumewithAI Enhanced Version</span>
                </div>
                <Badge variant="brand" size="sm">Fact Preserved</Badge>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-brand-200 dark:border-brand-900 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-2 font-medium">
                <p>• "Architected responsive web applications using React and TypeScript, standardizing modular components."</p>
                <p>• "Resolved client inquiries and streamlined communication workflows to reduce response cycle times."</p>
                <p>• "Executed targeted digital campaigns across multiple channels, elevating engagement and audience reach."</p>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                ✓ 94% ATS Keyword Alignment • Zero fictional facts created
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 10+ TEMPLATES SHOWCASE */}
      <section className="py-20 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
                10+ Recruiter-Approved Templates
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Engineered for maximum readability across ATS software and executive hiring managers.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              onClick={() => navigate('/create')}
            >
              Use Any Template Free
            </Button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate('/create')}
                className="group rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-2xs hover:shadow-xl hover:border-brand-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                    {t.name}
                  </h3>
                  {t.tag && <Badge variant="brand" size="sm">{t.tag}</Badge>}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {t.description}
                </p>

                {/* Template Mock Card */}
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 space-y-2 group-hover:scale-[1.02] transition-transform">
                  <div className="w-1/2 h-2.5 rounded bg-neutral-800 dark:bg-white" />
                  <div className="w-1/3 h-2 rounded bg-brand-500" />
                  <div className="w-full h-1.5 rounded bg-neutral-300 dark:bg-neutral-700 mt-3" />
                  <div className="w-5/6 h-1.5 rounded bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-4/6 h-1.5 rounded bg-neutral-300 dark:bg-neutral-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI TOOLS SUITE */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="brand" icon={Bot}>Full Career Suite</Badge>
            <h2 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
              Everything You Need to Land the Offer
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              More than a resume form — your personal AI career copilot from drafting to mock interview prep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'ATS Matcher & Job Tailor',
                desc: 'Paste any job posting to analyze keyword alignment, identify missing skills, and generate tailored summaries.',
              },
              {
                icon: Wand2,
                title: 'Role-Adaptive AI Enhancer',
                desc: 'Tailored recommendations adapting specifically to Software Engineers, Designers, Managers, Students, and Healthcare professionals.',
              },
              {
                icon: FileCheck,
                title: 'AI Cover Letter Generator',
                desc: 'Generate customized, compelling cover letters tailored to your target company with tone controls (Formal, Confident, Concise).',
              },
              {
                icon: Target,
                title: 'Skill Gap Analyzer',
                desc: 'Compare your profile against top market requisites and discover the 3 high-impact skills to acquire next.',
              },
              {
                icon: Users,
                title: 'Biodata & CV Builder',
                desc: 'Dedicated builders for matrimony/personal biodatas and multi-section academic curriculum vitaes.',
              },
              {
                icon: Zap,
                title: 'AI Mock Interview Coach',
                desc: 'Practice role-specific STAR method behavioral and technical questions based on your resume entries.',
              },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-3 hover:border-brand-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                  {tool.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-20 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Clear answers about privacy, AI safeguards, and ATS compatibility.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-tr from-brand-600 via-orange-600 to-amber-500 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight">
            Ready to Build Your Winning Resume?
          </h2>
          <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto">
            Join thousands of professionals, graduates, and developers creating standout resumes in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="outline"
              size="lg"
              icon={Sparkles}
              onClick={() => navigate('/create')}
              className="bg-white text-brand-600 hover:bg-neutral-100 border-none font-bold text-base shadow-xl"
            >
              Create My Resume Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
