/**
 * Deep Linking Configuration for ComicKunMart
 * 
 * This file contains all deep link configurations and utilities
 */

export const DEEP_LINK_SCHEME = 'comickunmart';

/**
 * Deep Link Routes
 * Format: scheme://host/path
 */
export const DeepLinkRoutes = {
  // Home
  HOME: `${DEEP_LINK_SCHEME}://home`,
  
  // Comic details
  COMIC_DETAIL: (comicId: string) => `${DEEP_LINK_SCHEME}://comics/${comicId}`,
  
  // Chapter reading
  CHAPTER_READ: (comicId: string, chapterId: string) => `${DEEP_LINK_SCHEME}://comics/${comicId}/read/${chapterId}`,
  
  // Auth
  LOGIN: `${DEEP_LINK_SCHEME}://auth/login`,
  REGISTER: `${DEEP_LINK_SCHEME}://auth/register`,
  
  // Profile
  PROFILE: `${DEEP_LINK_SCHEME}://profile`,
  
  // Search
  SEARCH: `${DEEP_LINK_SCHEME}://search`,
} as const;

/**
 * Generate deep link for sharing comic
 */
export function generateComicShareLink(comicId: string, comicTitle?: string) {
  const link = DeepLinkRoutes.COMIC_DETAIL(comicId);
  
  if (comicTitle) {
    return {
      url: link,
      message: `Check out this comic: ${comicTitle}`,
      title: comicTitle,
    };
  }
  
  return {
    url: link,
    message: 'Check out this comic!',
    title: 'Comic',
  };
}

/**
 * Generate deep link for sharing chapter
 */
export function generateChapterShareLink(comicId: string, chapterId: string, chapterTitle?: string) {
  const link = DeepLinkRoutes.CHAPTER_READ(comicId, chapterId);
  
  if (chapterTitle) {
    return {
      url: link,
      message: `Read this chapter: ${chapterTitle}`,
      title: chapterTitle,
    };
  }
  
  return {
    url: link,
    message: 'Read this chapter!',
    title: 'Chapter',
  };
}

/**
 * Parse deep link URL to extract parameters
 */
export function parseDeepLink(url: string) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    return {
      scheme: urlObj.protocol.replace(':', ''),
      host: urlObj.hostname,
      path: urlObj.pathname,
      pathParts,
      params: Object.fromEntries(urlObj.searchParams),
    };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

/**
 * Check if URL is a valid deep link for this app
 */
export function isValidDeepLink(url: string): boolean {
  return url.startsWith(`${DEEP_LINK_SCHEME}://`);
}