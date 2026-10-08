import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'ai' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-sm',
    md: 'text-sm px-4 py-2.5 gap-2 shadow-sm',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow',
  };

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand hover:shadow-orange-500/30 focus:ring-brand-500',
    secondary: 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 focus:ring-brand-400 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800',
    outline: 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 focus:ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 focus:ring-neutral-300 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200',
    ai: 'bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white shadow-brand hover:shadow-orange-500/40 focus:ring-brand-500 border border-orange-400/30',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm focus:ring-red-500',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : variant === 'ai' ? (
        <Sparkles className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
      ) : null}

      <span>{children}</span>

      {IconRight && !isLoading && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
