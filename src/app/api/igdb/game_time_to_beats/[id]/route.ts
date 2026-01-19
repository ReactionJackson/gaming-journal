import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any, context: any) {
  const { id } = await context.params;

  const igdbQuery = `
    fields hastily, normally, completely, count;
    where game_id = ${id};
    limit 1;
  `;

  const res = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN!}`,
      "Content-Type": "text/plain",
    },
    body: igdbQuery,
  });

  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: "IGDB time_to_beat failed", details: text },
      { status: 500 }
    );
  }
  const [data] = JSON.parse(text);

  const formatTimes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  if (!data) {
    return NextResponse.json({ message: "No time data found" });
  }

  return NextResponse.json({
    hastily: data.hastily ? formatTimes(data.hastily) : null,
    normally: data.normally ? formatTimes(data.normally) : null,
    completely: data.completely ? formatTimes(data.completely) : null,
    count: data.count ?? 0,
  });
}
