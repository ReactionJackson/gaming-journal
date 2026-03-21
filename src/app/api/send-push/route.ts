import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:joejackson@numiko.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { subscription, delay = 10 } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Missing push subscription' }, { status: 400 });
    }

    // Wait the requested delay, then send the push
    await new Promise(resolve => setTimeout(resolve, delay * 1000));

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Gaming Journal',
        body: 'hello'
      })
    );

    return NextResponse.json({ message: 'Push sent' });
  } catch (error: any) {
    console.error('Push send error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
