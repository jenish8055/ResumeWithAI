import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LayoutTemplate,
  Bot,
  Mail,
  Users,
  Compass,
  User,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const { experienceMode } = useResumeStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Resume', path: '/create', icon: PlusCircle, isHighlight: true },
    { label: 'Resume Templates', path: '/templates', icon: LayoutTemplate },
    { label: 'AI Career Tools', path: '/ai-tools', icon: Bot },
    { label: 'AI Cover Letter', path: '/cover-letter', icon: Mail },
    { label: 'Biodata Builder', path: '/biodata', icon: Users },
    { label: 'Career Coach & Mock', path: '/career-coach', icon: Compass },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings & Privacy', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Experience Mode Status Card */}
        <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-brand-950/30 border border-orange-200/60 dark:border-brand-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Mode:
            </span>
          </div>
          <Badge variant="brand" size="sm" className="capitalize">
            {experienceMode}
          </Badge>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-brand shadow-orange-500/20'
                    : item.isHighlight
                    ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 font-bold'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Local-First Privacy Guarantee */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Local-First Storage</span>
        </div>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
          Your resumes & activity logs stay on this device.
        </p>
      </div>
    </aside>
  );
}
