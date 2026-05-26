'use client';
import type { FilterOption, Category } from '@/types';
import { CATEGORY_LABELS } from '@/types';

interface FilterBarProps {
  filter: FilterOption;
  onFilterChange: (f: FilterOption) => void;
  counts: Record<FilterOption, number>;
}

const FILTERS: { key: FilterOption; label: string; emoji: string }[] = [
  { key: 'all', label: 'すべて', emoji: '✨' },
  { key: 'convenience', label: CATEGORY_LABELS.convenience, emoji: '🏪' },
  { key: 'cafe', label: CATEGORY_LABELS.cafe, emoji: '☕' },
  { key: 'snack', label: CATEGORY_LABELS.snack, emoji: '🍬' },
  { key: 'gourmet', label: CATEGORY_LABELS.gourmet, emoji: '🍔' },
];

export function FilterBar({ filter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      {FILTERS.map(({ key, label, emoji }) => {
        const active = filter === key;
        const count = counts[key] ?? 0;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 text-sm font-medium transition-colors relative ${
              active
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            <span className="text-base">{emoji}</span>
            <span className="text-xs mt-0.5 whitespace-nowrap">{label}</span>
            {count > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
            )}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
