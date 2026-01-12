export type Profile = {
  id: string;
  username?: string;
  email?: string;
  role?: 'user' | 'creator';
  avatar_url?: string;
  created_at?: string;
};