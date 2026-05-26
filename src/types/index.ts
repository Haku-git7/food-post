export type Account = 'sweets' | 'gourmet';
export type Category = 'convenience' | 'cafe' | 'snack' | 'gourmet';
export type FilterOption = Category | 'all';

export const ACCOUNT_LABELS: Record<Account, { label: string; emoji: string }> = {
  sweets: { label: 'スイーツ', emoji: '🍰' },
  gourmet: { label: 'グルメ', emoji: '🍔' },
};

export const CATEGORY_LABELS: Record<Category, string> = {
  convenience: 'コンビニ',
  cafe: 'カフェ・チェーン',
  snack: 'お菓子メーカー',
  gourmet: 'グルメ',
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  convenience: {
    bg: 'bg-blue-100 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  cafe: {
    bg: 'bg-amber-100 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  snack: {
    bg: 'bg-pink-100 dark:bg-pink-950',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800',
  },
  gourmet: {
    bg: 'bg-green-100 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
};

export interface Post {
  id: string;
  account: Account;
  category: Category;
  chainName: string;
  productName: string;
  imageUrl: string;
  tweetText: string;
  features: string;
  releaseDate: string;
  sourceUrl: string;
}

export interface PostWithState extends Post {
  posted: boolean;
}
