import React from 'react';

export function FormInput({
  label,
  id,
  name,
  value = '',
  onChange,
  placeholder = '',
  type = 'text',
  icon: Icon,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 select-none"
        >
          {label} {required && <span className="text-brand-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border text-sm transition-all duration-150 outline-none
            ${Icon ? 'pl-10 pr-3.5' : 'px-3.5'} py-2.5
            bg-white dark:bg-neutral-900 
            text-neutral-900 dark:text-neutral-100
            placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            }
            disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}

export function FormTextarea({
  label,
  id,
  name,
  value = '',
  onChange,
  placeholder = '',
  rows = 4,
  error,
  helperText,
  aiAction,
  onAiAction,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={id || name}
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 select-none"
          >
            {label}
          </label>
        )}
        {aiAction && (
          <button
            type="button"
            onClick={onAiAction}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="text-amber-500">✨</span> {aiAction}
          </button>
        )}
      </div>

      <textarea
        id={id || name}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded-xl border text-sm transition-all duration-150 outline-none px-3.5 py-2.5
          bg-white dark:bg-neutral-900 
          text-neutral-900 dark:text-neutral-100
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
          }
          disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
