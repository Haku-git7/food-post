'use client';
import { useState, useEffect } from 'react';
import postsData from '@/data/posts.json';
import type { Account, FilterOption, PostWithState } from '@/types';

const STORAGE_KEY = 'food-post-posted';

export function usePosts() {
  const [posts, setPosts] = useState<PostWithState[]>(() =>
    postsData.map((p) => ({ ...p, posted: false }) as PostWithState)
  );
  const [account, setAccountState] = useState<Account>('sweets');
  const [filter, setFilter] = useState<FilterOption>('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const postedIds: string[] = JSON.parse(stored);
        setPosts((prev) =>
          prev.map((p) => ({ ...p, posted: postedIds.includes(p.id) }))
        );
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const setAccount = (next: Account) => {
    setAccountState(next);
    setFilter('all');
  };

  const togglePosted = (id: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, posted: !p.posted } : p
      );
      const postedIds = updated.filter((p) => p.posted).map((p) => p.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(postedIds));
      return updated;
    });
  };

  const accountPosts = posts.filter((p) => p.account === account);
  const filteredPosts =
    filter === 'all' ? accountPosts : accountPosts.filter((p) => p.category === filter);

  return {
    posts: filteredPosts,
    allPosts: accountPosts,
    account,
    setAccount,
    filter,
    setFilter,
    togglePosted,
  };
}
