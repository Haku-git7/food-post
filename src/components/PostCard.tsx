'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { PostWithState } from '@/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types';

interface PostCardProps {
  post: PostWithState;
  onTogglePosted: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function PostCard({ post, onTogglePosted }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const isDummyImage = !post.imageUrl || post.imageUrl.includes('picsum.photos');
  const showPlaceholder = isDummyImage || imgError;

  const colors = CATEGORY_COLORS[post.category];
  const displayText = generatedText ?? post.tweetText;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = displayText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/generate-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainName: post.chainName,
          productName: post.productName,
          releaseDate: post.releaseDate,
          features: post.features,
          account: post.account,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '生成に失敗しました');
      setGeneratedText(data.tweetText);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : '文章の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <article
      className={`border-b border-gray-200 dark:border-gray-800 p-4 transition-colors ${
        post.posted ? 'bg-gray-50 dark:bg-gray-950' : 'bg-white dark:bg-black'
      }`}
    >
      {/* Header: chain name + category badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
            {post.category === 'convenience' ? '🏪' :
             post.category === 'cafe' ? '☕' :
             post.category === 'snack' ? '🍬' : '🍔'}
          </div>
          <div>
            <p className={`text-sm font-bold ${post.posted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {post.chainName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.releaseDate)} 発売</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
          {CATEGORY_LABELS[post.category]}
        </span>
      </div>

      {/* Product name */}
      <h2 className={`text-base font-bold mb-3 ${post.posted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
        {post.productName}
      </h2>

      {/* Product image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
        {showPlaceholder ? (
          <div className={`w-full h-full flex items-center justify-center ${post.posted ? 'opacity-40' : 'opacity-100'}`}>
            <span className="text-sm text-gray-400 dark:text-gray-500 text-center px-6 leading-relaxed">
              {post.productName}
            </span>
          </div>
        ) : (
          <Image
            src={post.imageUrl}
            alt={post.productName}
            fill
            className={`object-cover transition-opacity ${post.posted ? 'opacity-40' : 'opacity-100'}`}
            sizes="(max-width: 640px) 100vw, 576px"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Tweet text */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            投稿文
            {generatedText && (
              <span className="ml-1.5 text-sky-500">✨ AI生成済み</span>
            )}
          </span>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中…
              </>
            ) : (
              <>✨ AI生成</>
            )}
          </button>
        </div>

        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 pr-10">
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {displayText}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="投稿文をコピー"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>

        {copied && (
          <p className="text-xs text-green-500 mt-1 ml-1">コピーしました！</p>
        )}
        {generateError && (
          <p className="text-xs text-red-500 mt-1 ml-1">{generateError}</p>
        )}
      </div>

      {/* Footer: source URL + posted checkbox */}
      <div className="flex items-center justify-between">
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 hover:underline truncate max-w-[60%]"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="truncate">出典を開く</span>
        </a>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={post.posted}
              onChange={() => onTogglePosted(post.id)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                post.posted ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                post.posted ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className={`text-xs font-medium ${post.posted ? 'text-sky-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {post.posted ? '投稿済み ✓' : '未投稿'}
          </span>
        </label>
      </div>
    </article>
  );
}
