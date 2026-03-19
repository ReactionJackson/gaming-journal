import { getGame } from "@/lib/igdb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing game id" }, { status: 400 });
  }

  const game = await getGame(id);

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  return Response.json(game);
}
