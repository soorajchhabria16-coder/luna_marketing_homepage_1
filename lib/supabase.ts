import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BirthChart = {
  id?: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  location: string;
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  created_at?: string;
};
