import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Fireflies webhook received:', body.event, body.meeting_id);

    if (body.event !== 'meeting.transcribed') {
      return NextResponse.json({ status: 'ignored', event: body.event });
    }

    return NextResponse.json({
      status: 'ok',
      meeting_id: body.meeting_id,
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'd4tw-wiki-fireflies-webhook' });
}
