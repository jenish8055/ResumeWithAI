import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useResumeStore } from '../features/resume/resumeStore';
import { aiService } from '../services/ai/aiService';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Zap,
  Bot,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function AIToolsPage() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();

  const [activeTool, setActiveTool] = useState('ats'); // 'ats' | 'skillgap' | 'interview' | 'coach'
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [targetSkillInput, setTargetSkillInput] = useState(activeResume?.targetRole || 'Software Engineer');

  const handleRunAtsAnalysis = async () => {
    if (!jobDescription.trim()) {
      showToast('Please paste a job description to analyze keyword match.', 'info');
      return;
    }
    setIsLoading(true);
    try {
      const res = await aiService.analyzeJobDescription(activeResume, jobDescription, activeResume?.id);
      setAnalysisResult({ type: 'ats', data: res });
      showToast('ATS analysis completed!', 'success');
    } catch (err) {
      console.error(err);
      showToast('ATS analysis failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunSkillGap = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.skillGapAnalysis(targetSkillInput, activeResume?.skills || []);
      setAnalysisResult({ type: 'skillgap', data: res });
      showToast('Skill gap breakdown generated!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Skill gap analysis failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunInterviewPrep = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.generateInterviewQuestions(
        activeResume?.personalInfo?.professionalTitle || targetSkillInput,
        activeResume?.experience || []
      );
      setAnalysisResult({ type: 'interview', data: res });
      showToast('Mock interview questions generated!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate interview questions.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div>
            <Badge variant="brand" icon={Bot}>AI Copilot Suite</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mt-1">
              AI Career Tools
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Tailor your resume, simulate hiring manager screenings, and uncover competitive advantages.
            </p>
          </div>

          {/* Tool Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ats', label: 'ATS Job Matcher', icon: ShieldCheck },
              { id: 'skillgap', label: 'Skill Gap Analyzer', icon: Target },
              { id: 'interview', label: 'AI Mock Interview', icon: HelpCircle },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTool(t.id);
                  setAnalysisResult(null);
                }}
                className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-2xl font-bold transition-all cursor-pointer ${
                  activeTool === t.id
                    ? 'bg-brand-500 text-white shadow-brand shadow-orange-500/20'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* TOOL 1: ATS JOB MATCHER */}
          {activeTool === 'ats' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                  Target Job Description Analyzer
                </h3>
                <p className="text-xs text-neutral-500">
                  Compare your active resume "{activeResume?.resumeName}" against any job listing.
                </p>
              </div>

              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description (responsibilities, required qualifications, tech stack)..."
                className="w-full text-xs p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-brand-500 text-neutral-900 dark:text-white"
              />

              <Button
                variant="ai"
                size="md"
                icon={Sparkles}
                isLoading={isLoading}
                onClick={handleRunAtsAnalysis}
              >
                Analyze ATS Alignment
              </Button>

              {analysisResult?.type === 'ats' && (
                <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  {/* Score Card */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-orange-50 dark:bg-brand-950/40 border border-orange-200 dark:border-brand-800 gap-4">
                    <div className="text-center sm:text-left">
                      <span className="text-xs font-bold text-neutral-500">Predicted Match Rate</span>
                      <h4 className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                        {analysisResult.data.matchScore}% Match
                      </h4>
                    </div>
                    <div className="flex gap-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      <div>✓ {analysisResult.data.matchedSkills.length} Matched Keywords</div>
                      <div className="text-amber-600">⚠ {analysisResult.data.missingSkills.length} Missing Keywords</div>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Matched Keywords Found in Resume
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.data.matchedSkills.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                        Missing Keywords to Highlight
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.data.missingSkills.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 bg-white dark:bg-neutral-800 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOL 2: SKILL GAP */}
          {activeTool === 'skillgap' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                  Skill Gap & Industry Competency Analyzer
                </h3>
                <p className="text-xs text-neutral-500">
                  Identifies strong competencies and top 3 high-impact skills to acquire next.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={targetSkillInput}
                  onChange={(e) => setTargetSkillInput(e.target.value)}
                  placeholder="Target Role (e.g. Senior Frontend Engineer)"
                  className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-brand-500"
                />
                <Button
                  variant="primary"
                  size="md"
                  icon={Target}
                  isLoading={isLoading}
                  onClick={handleRunSkillGap}
                >
                  Analyze Skills
                </Button>
              </div>

              {analysisResult?.type === 'skillgap' && (
                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="p-4 bg-orange-50 dark:bg-brand-950/40 rounded-2xl border border-orange-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-700">Market Readiness</span>
                    <Badge variant="brand">{analysisResult.data.readinessRating}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                      <span className="text-xs font-bold text-neutral-500">Strong Core Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.data.strongSkills.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                      <span className="text-xs font-bold text-neutral-500">Recommended Skills to Learn</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.data.highImpactSkillsToLearnNext.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOL 3: INTERVIEW PREP */}
          {activeTool === 'interview' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                    AI Mock Interview Simulator
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Generates behavioral, role-specific, and STAR method questions derived from your resume.
                  </p>
                </div>
                <Button
                  variant="ai"
                  size="md"
                  icon={Sparkles}
                  isLoading={isLoading}
                  onClick={handleRunInterviewPrep}
                >
                  Generate Questions
                </Button>
              </div>

              {analysisResult?.type === 'interview' && (
                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  {analysisResult.data.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2"
                    >
                      <Badge variant="brand" size="sm">{q.category}</Badge>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {q.question}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        💡 <strong>STAR Tip:</strong> {q.tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
