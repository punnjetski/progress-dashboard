// Edge Function entry point. Deployed with JWT verification OFF: callers prove themselves with their own AI token instead.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { handle } from './core.ts';

const url = Deno.env.get('SUPABASE_URL')!;
// The server-side key stays inside the function. It is never sent to any AI.
const key = Deno.env.get('SB_SECRET_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

Deno.serve((req) => handle(req, { db, tz: Deno.env.get('TZ_NAME') ?? 'Asia/Bangkok' }));
