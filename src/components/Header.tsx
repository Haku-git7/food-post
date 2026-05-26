'use client';
import type { Account } from '@/types';
import { ACCOUNT_LABELS } from '@/types';

interface HeaderProps {
  dark: boolean;
  onToggleDark: () => void;
  postedCount: number;
  totalCount: number;
  account: Account;
  onAccountChange: (account: Account) => void;
}

export function Header({ dark, onToggleDark, postedCount, totalCount, account, onAccountChange }: HeaderProps) {
  const { label, emoji } = ACCOUNT_LABELS[account];

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              {label}Post
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {postedCount}/{totalCount} 投稿済み
            </p>
          </div>
        </div>
        <button
          onClick={onToggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={dark ? 'ライトモードに切替' : 'ダークモードに切替'}
        >
          {dark ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 00-1.06 1.06l1.59 1.59a.75.75 0 001.06-1.06L6.166 6.166z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Account switcher tabs */}
      <div className="max-w-xl mx-auto flex border-t border-gray-200 dark:border-gray-800">
        {(Object.keys(ACCOUNT_LABELS) as Account[]).map((acc) => {
          const { label: accLabel, emoji: accEmoji } = ACCOUNT_LABELS[acc];
          const active = account === acc;
          return (
            <button
              key={acc}
              onClick={() => onAccountChange(acc)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors relative ${
                active
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <span>{accEmoji}</span>
              <span>{accLabel}</span>
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
