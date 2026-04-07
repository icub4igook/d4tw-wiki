import { cookies } from "next/headers";

const COOKIE_NAME = "d4tw_wiki_auth";
const SESSION_SECRET = "d4tw-wiki-session-2026";

export function isPasswordExpired(): boolean {
  const setDate = process.env.WIKI_PASSWORD_SET_DATE;
  const maxDays = parseInt(process.env.WIKI_PASSWORD_MAX_AGE_DAYS || "30");
  if (!setDate) return true;
  
  const set = new Date(setDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - set.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= maxDays;
}

export function daysUntilExpiry(): number {
  const setDate = process.env.WIKI_PASSWORD_SET_DATE;
  const maxDays = parseInt(process.env.WIKI_PASSWORD_MAX_AGE_DAYS || "30");
  if (!setDate) return 0;
  
  const set = new Date(setDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - set.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, maxDays - diffDays);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token) return false;
  // Simple token validation
  return token.value === Buffer.from(SESSION_SECRET + process.env.WIKI_PASSWORD_HASH).toString("base64").slice(0, 44);
}

export function generateToken(): string {
  return Buffer.from(SESSION_SECRET + process.env.WIKI_PASSWORD_HASH).toString("base64").slice(0, 44);
}
