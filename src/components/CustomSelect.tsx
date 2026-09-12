import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string | number;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[] | T[];
  placeholder?: string;
  label?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  id?: string;
  disabled?: boolean;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  className = '',
  triggerClassName = '',
  dropdownClassName = '',
  id,
  disabled = false,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const normalizedOptions: SelectOption<T>[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt as T, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
        const nextIndex = (currentIndex + 1) % normalizedOptions.length;
        onChange(normalizedOptions[nextIndex].value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
        const prevIndex = (currentIndex - 1 + normalizedOptions.length) % normalizedOptions.length;
        onChange(normalizedOptions[prevIndex].value);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-wider text-[#2D2D2A] dark:text-[#E6E4DF] block mb-1"
        >
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E2] dark:border-[var(--theme-border-dark)] text-[#2D2D2A] dark:text-[#F3F2EE] text-xs sm:text-sm font-medium transition-all shadow-2xs hover:border-[var(--theme-primary)] dark:hover:border-[var(--theme-primary-dark)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] dark:focus:ring-[var(--theme-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge !== undefined && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#A3A39E] dark:text-[#878680] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E2] dark:border-[var(--theme-border-dark)] shadow-xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 ${dropdownClassName}`}
        >
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                role="option"
                key={option.value}
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold'
                    : 'text-[#4D4D47] dark:text-[#D5D4CE] hover:bg-[#FAF9F6] dark:hover:bg-[var(--theme-bg-dark)] hover:text-[#2D2D2A] dark:hover:text-[#F3F2EE]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <div className="truncate">
                    <div className="truncate">{option.label}</div>
                    {option.description && (
                      <div className="text-[11px] text-[#A3A39E] dark:text-[#878680] font-normal truncate">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {option.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] text-[#7D7D76] dark:text-[#A8A7A0] font-mono">
                      {option.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
