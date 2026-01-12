import Constants from 'expo-constants';

const scheme = (Constants.expoConfig?.scheme as string) || 'comickunmart';

export const buildDeepLink = (path: string) => `${scheme}://${path.replace(/^\//, '')}`;

// Contoh:
// buildDeepLink('/auth/login') -> comickunmart://auth/login
// buildDeepLink('/comic/123')  -> comickunmart://comic/123