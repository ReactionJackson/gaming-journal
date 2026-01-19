import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const igdbQuery = `
    search "${query}";
    fields id, name, cover.image_id, game_type;
    where game_type = (0,4,8,9,10) & version_parent = null;
    limit 50;
  `;

  const res = await fetch("https://api.igdb.com/v4/games", {
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
      { error: "IGDB request failed", details: text },
      { status: 500 }
    );
  }

  const raw = JSON.parse(text);

  const games = raw.map((game: any) => ({
    id: game.id,
    name: game.name,
    type: game.game_type,
    coverUrl: game.cover
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null,
  }));

  return NextResponse.json(games);
}
