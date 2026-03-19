import { searchGames } from "@/lib/igdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const games = await searchGames(query);
  return Response.json(games);
}
