import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useResumeStore } from '../features/resume/resumeStore';
import { aiService } from '../services/ai/aiService';
import { Sparkles, Compass, Target, ArrowRight, CheckCircle2, TrendingUp, BookOpen, Star } from 'lucide-react';

export default function CareerCoachPage() {
  const { activeResume, showToast } = useResumeStore();
  const [goal, setGoal] = useState('Senior / Staff Role Transition');
  const [isLoading, setIsLoading] = useState(false);
  const [coachPlan, setCoachPlan] = useState(null);

  const handleGetCoachAdvice = async () => {
    setIsLoading(true);
    try {
      const advice = await aiService.careerCoach(
        {
          targetRole: activeResume?.personalInfo?.professionalTitle || 'Software Engineer',
          experienceLevel: 'Intermediate',
          profession: activeResume?.profession,
        },
        goal
      );
      setCoachPlan(advice);
      showToast('Career roadmap generated!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate career advice.', 'error');
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
            <Badge variant="brand" icon={Compass}>Strategic AI Coach</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mt-1">
              AI Career Coach & Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Personalized career progression milestones, high-priority learning paths, and interview strategies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What is your next career target? (e.g. Lead Engineer at Tier 1 Tech)"
                className="flex-1 text-xs px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none focus:border-brand-500"
              />
              <Button
                variant="ai"
                size="md"
                icon={Sparkles}
                isLoading={isLoading}
                onClick={handleGetCoachAdvice}
              >
                Generate Career Strategy
              </Button>
            </div>
          </div>

          {coachPlan ? (
            <div className="space-y-6">
              {/* Next Roles */}
              <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Target Progression Paths
                </span>
                <div className="flex flex-wrap gap-2">
                  {coachPlan.recommendedRoles.map((r, i) => (
                    <Badge key={i} variant="brand" size="md" icon={TrendingUp}>{r}</Badge>
                  ))}
                </div>
              </div>

              {/* Strategic Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" /> Strategic Action Items
                  </h3>
                  <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                    {coachPlan.strategicAdvice.map((adv, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-500" /> 90-Day Execution Milestones
                  </h3>
                  <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                    {coachPlan.quarterlyMilestones.map((m, idx) => (
                      <div key={idx} className="p-3 bg-orange-50/50 dark:bg-brand-950/30 rounded-xl border border-orange-100 dark:border-brand-900 font-medium">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-400 space-y-2 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <Compass className="w-10 h-10 mx-auto text-brand-500 animate-pulse" />
              <p className="text-sm font-semibold">Enter your target goal above and click "Generate Career Strategy".</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
