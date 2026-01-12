export type Creator = {
  id: string;
  username: string;
};

export type Comic = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  creator_id?: string;
  creator?: Creator;
  genre?: string;
  created_at?: string;
};