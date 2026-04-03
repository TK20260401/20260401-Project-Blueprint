import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

export type { User, Session };

/** メールとパスワードで新規登録 */
export async function signUp(email: string, password: string) {
  if (!supabase) return { user: null, error: new Error("Not connected") };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data.user, error };
}

/** メールとパスワードでログイン */
export async function signIn(email: string, password: string) {
  if (!supabase) return { user: null, session: null, error: new Error("Not connected") };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data.user, session: data.session, error };
}

/** ログアウト */
export async function signOut() {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** 現在のセッションを取得 */
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** 現在のユーザーを取得 */
export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** 認証状態の変更を監視 */
export function onAuthStateChange(
  callback: (user: User | null) => void
) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
