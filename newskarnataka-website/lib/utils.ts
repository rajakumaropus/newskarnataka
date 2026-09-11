export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const getImageUrl = (url: string): string => {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://103.191.208.235:1337';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
};

export const getReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const cn = (...classes: (string | false | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
