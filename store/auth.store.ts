import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Profile } from '../types/user.type';

type AuthState = {
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  loading: false,
  async login(email, password) {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { set({ loading: false }); return false; }
    await get().fetchProfile();
    set({ loading: false });
    return !!data.session;
  },
  async register(email, password) {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { set({ loading: false }); return false; }
    await get().fetchProfile();
    set({ loading: false });
    return !!data.user;
  },
  async fetchProfile() {
    set({ loading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { set({ profile: null, loading: false }); return; }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (!data) {
      // Buat profil default jika belum ada
      const email = user.email ?? '';
      const username = email ? email.split('@')[0] : `user_${user.id.slice(0, 6)}`;
      const { error: upsertError } = await supabase.from('profiles').upsert({ id: user.id, email, username, role: 'user', avatar_url: null });
      const { data: created } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (!created && upsertError) {
        // Fallback: set profil lokal agar UI tidak memaksa login ulang
        set({ profile: { id: user.id, email, username, role: 'user', avatar_url: undefined } as Profile, loading: false });
        return;
      }
      set({ profile: created ?? null, loading: false });
    } else {
      set({ profile: data, loading: false });
    }
  },
  async logout() {
    await supabase.auth.signOut();
    set({ profile: null });
  },
}));