import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = 'https://comcbgptiwzdzqrbxulv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbWNiZ3B0aXd6ZHpxcmJ4dWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNzAzMDAsImV4cCI6MjAzMDg0NjMwMH0.OCqwu3PtHsg-zbvH5T8K9B-42NUyh2TN7HWKWdUF5iI';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient = createBrowserClient(
    SUPABASE_URL,
    SUPABASE_KEY,
  );
  _session: AuthSession | null = null;

  init() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._session = session;
      console.log({ event });
      console.log({ session });
    });

    this.supabase.auth.getUser().then(console.log);
  }

  async signInWithGithub() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/api/v1/auth/callback',
      },
    });
    console.log(data, error);

    if (data.url) {
      console.log(data.url);
      // await fetch(data.url) // use the redirect API for your server framework
    }
  }
}
