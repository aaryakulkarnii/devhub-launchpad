import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '../../../lib/supabaseClient';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabaseConfigured: isSupabaseConfigured,
    platform: 'DevHub Launchpad Fullstack Backend'
  });
}
