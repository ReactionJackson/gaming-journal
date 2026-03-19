import { Redis } from "@upstash/redis";
import { kvKey } from "@/lib/kvKey";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  const key = kvKey("entry", "test-1");
  const data = await redis.get(key);
  return NextResponse.json({ key, data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const key = kvKey("entry", "test-1");
  await redis.set(key, body);
  return NextResponse.json({ ok: true, key, saved: body });
}
