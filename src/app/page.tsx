'use client';

import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { useTheme } from '@/hooks/useTheme';
import type { FilterOption } from '@/types';

export default function Home() {
  const { posts, allPosts, account, setAccount, filter, setFilter, togglePosted } = usePosts();
  const { dark, toggle } = useTheme();

  const postedCount = allPosts.filter((p) => p.posted).length;

  const counts: Record<FilterOption, number> = {
    all: allPosts.length,
    convenience: allPosts.filter((p) => p.category === 'convenience').length,
    cafe: allPosts.filter((p) => p.category === 'cafe').length,
    snack: allPosts.filter((p) => p.category === 'snack').length,
    gourmet: allPosts.filter((p) => p.category === 'gourmet').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        dark={dark}
        onToggleDark={toggle}
        postedCount={postedCount}
        totalCount={allPosts.length}
        account={account}
        onAccountChange={setAccount}
      />

      <main className="max-w-xl mx-auto bg-white dark:bg-black min-h-screen border-x border-gray-200 dark:border-gray-800">
        <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-sm">該当する投稿がありません</p>
          </div>
        ) : (
          <div className="pb-safe">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onTogglePosted={togglePosted} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
