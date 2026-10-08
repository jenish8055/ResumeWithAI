import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AIButton({
  children = 'AI Assist',
  onClick,
  size = 'sm', // 'xs' | 'sm' | 'md'
  isLoading = false,
  variant = 'brand', // 'brand' | 'subtle' | 'floating'
  className = '',
  iconOnly = false,
}) {
  const sizeStyles = {
    xs: 'text-[11px] px-2 py-1 gap-1',
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
  };

  const variantStyles = {
    brand: 'bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white shadow-sm hover:shadow-orange-500/25 border border-orange-400/30',
    subtle: 'bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
    floating: 'bg-gradient-to-r from-brand-500 to-amber-500 text-white shadow-brand hover:shadow-orange-500/40 border border-white/20',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      )}
      {!iconOnly && <span>{children}</span>}
    </button>
  );
}
