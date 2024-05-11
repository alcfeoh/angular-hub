import { defineEventHandler, getQuery, sendRedirect, getHeaders } from 'h3';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://comcbgptiwzdzqrbxulv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbWNiZ3B0aXd6ZHpxcmJ4dWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNzAzMDAsImV4cCI6MjAzMDg0NjMwMH0.OCqwu3PtHsg-zbvH5T8K9B-42NUyh2TN7HWKWdUF5iI';

function parseCookies(cookieHeader: string, cookieName: string): string {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name.trim() === cookieName) {
      return value.trim();
    }
  }
  return null;
}

export default defineEventHandler(async (event) => {
  try {
    const { code, next }: { code: string; next: string } = getQuery(event);
    const headers = getHeaders(event);

    if (code) {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
          get: (name) => {
            const cookie = parseCookies(headers.cookie, name);
            return decodeURIComponent(cookie);
          },
          set: async (name, value, options) => {
            event.headers.set(
              'Set-Cookie',
              `${name}=${encodeURIComponent(
                value,
              )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000000`,
            );
          },
          remove: (name) => {
            event.headers.set(
              'Set-Cookie',
              `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
            );
          },
        },
      });

      await supabase.auth.exchangeCodeForSession(code);
    }

    return sendRedirect(event, next || '/', 302);
  } catch (e) {
    console.error('=>   errror', e);
  }
});
