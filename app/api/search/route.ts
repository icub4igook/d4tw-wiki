import { NextResponse } from 'next/server';
import { searchWiki } from '@/lib/wiki';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q || q.length < 2) return NextResponse.json([]);
  const results = await searchWiki(q);
  return NextResponse.json(results);
}
