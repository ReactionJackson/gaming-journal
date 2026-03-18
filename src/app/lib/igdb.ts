async function getAccessToken(): Promise<string> {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_ACCESS_TOKEN}&grant_type=client_credentials`,
    { method: "POST" },
  );

  const data = await res.json();
  return data.access_token;
}

export async function searchGames(query: string) {
  const token = await getAccessToken();

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: `search "${query}"; fields name, cover.url, summary, rating; limit 10;`,
  });

  return res.json();
}

export async function getGame(id: string) {
  const token = await getAccessToken();

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: `fields name, cover.url, summary, rating; where id = ${id};`,
  });

  const data = await res.json();
  return data[0] ?? null;
}
