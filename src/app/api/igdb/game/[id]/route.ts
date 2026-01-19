import { NextResponse } from "next/server";

export async function GET(req: any, context: any) {
  const { id } = await context.params;

  const igdbQuery = `
    fields
      id,
      name,
      summary,
      storyline,
      genres.name,
      platforms.name,
      involved_companies.company.name,
      first_release_date,
      cover.image_id,
      screenshots.image_id,
      artworks.image_id,
      aggregated_rating,
      rating;
    where id = ${id};
    limit 1;
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

  const [game] = JSON.parse(text);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: game.id,
    name: game.name,
    summary: game.summary ?? null,
    storyline: game.storyline ?? null,
    genres: game.genres?.map((g: any) => g.name) ?? [],
    platforms: game.platforms?.map((p: any) => p.name) ?? [],
    companies: game.involved_companies?.map((c: any) => c.company.name) ?? [],
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString()
      : null,
    rating: game.rating ?? null,
    aggregatedRating: game.aggregated_rating ?? null,
    coverUrl: game.cover
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : null,
    screenshots:
      game.screenshots?.map(
        (s: any) =>
          `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${s.image_id}.jpg`
      ) ?? [],
    artworks:
      game.artworks?.map(
        (a: any) =>
          `https://images.igdb.com/igdb/image/upload/t_1080p/${a.image_id}.jpg`
      ) ?? [],
  });
}
