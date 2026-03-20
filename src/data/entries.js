// ─────────────────────────────────────────────────────────────────────────────
// Games
//
// Each game owns its own entries array. An entry is a piece of writing about
// that game on a specific date. entryId in dayEntries is the index into this
// array. "Entry XX" display numbers are derived from that index.
// ─────────────────────────────────────────────────────────────────────────────

export const games = [
  {
    gameId: 1,
    title: "Xenoblade Chronicles 2",
    platform: "Nintendo Switch",
    genre: "JRPG",
    // Landscape screenshot — Cloud Sea of Alrest, no UI text
    cover: "https://images.launchbox-app.com/b7a444fc-f6b3-415c-b270-55b9aab05756.jpg",
    entries: [
      {
        // entryId: 0 → referenced by Mar 5 day entry
        text: "Still working through the affinity charts for the Torna blades. Patroka is done which took forever — her chart is massive compared to the others. Started on Akhos but hit a wall with one of the field skills needed, so ended up doing some sidequests in Uraya to grind it out. Not the most exciting session but it feels good to be making a dent in it. The Switch Family Collective makes it way less tedious, being able to share rare blades across saves is a lifesaver.",
        tags: ["Grinding", "Switch Family Collective"],
        gallery: [
          "https://images.launchbox-app.com/4b488f82-83f5-4088-a870-9ebe8f5c6c7d.jpg",
        ],
      },
      {
        // entryId: 1 → referenced by Mar 8 day entry
        text: "Finished Chapter 7 tonight. Wasn't expecting it to hit as hard as it did — there's a couple of reveals in there that reframe a lot of what happened earlier in the game. Mythra is absolutely carrying the party right now, the damage output is ridiculous once you get her specials chained properly. Jin is a great antagonist, actually feels threatening rather than just being a hurdle. Excited to see where it goes from here.",
        tags: ["Story", "Chapter 7"],
        gallery: [
          "https://images.launchbox-app.com/b7a444fc-f6b3-415c-b270-55b9aab05756.jpg",
        ],
      },
      {
        // entryId: 2 → referenced by Mar 20 day entry
        text: "Nearly there with the affinity charts. Rex and Pyra are fully maxed, Nia and Dromarch are done too. Just Zeke and Pandoria left which shouldn't take long. The endgame is in sight — I think I'm maybe three or four sessions away from finishing the main story. Bittersweet feeling, I've genuinely loved this one and I'm gonna miss having it as my active game.",
        tags: ["Affinity Charts", "Almost Done"],
        gallery: [
          "https://images.launchbox-app.com/4b488f82-83f5-4088-a870-9ebe8f5c6c7d.jpg",
          "https://images.launchbox-app.com/b7a444fc-f6b3-415c-b270-55b9aab05756.jpg",
        ],
      },
    ],
  },
  {
    gameId: 2,
    title: "Astral Chain",
    platform: "Nintendo Switch",
    genre: "Action",
    // In-game environment screenshot — neon city, no HUD text
    cover: "https://images.launchbox-app.com/df8e26e5-c114-4774-8d98-d76d6602df87.jpg",
    entries: [
      {
        // entryId: 0 → referenced by Mar 5 day entry
        text: "Started a fresh save on Astral Chain while Marc was here — he'd never seen it before and I wanted an excuse to play it again. The opening sequence still holds up, Platinum really nailed the vibe. The city design is incredible, it's got this cramped neon-soaked thing going on that I never get tired of looking at. Combat felt rusty at first but it comes back quickly. Probably going to stick with this as a secondary game alongside Xenoblade for a while.",
        tags: ["Revisiting"],
        gallery: [
          "https://images.launchbox-app.com/df8e26e5-c114-4774-8d98-d76d6602df87.jpg",
          "https://images.launchbox-app.com/9dd427ca-7e2c-4f12-a17c-0a25b2d43a2a.jpg",
        ],
      },
    ],
  },
  {
    gameId: 3,
    title: "Xenogears",
    platform: "PS1",
    genre: "JRPG",
    // In-game artwork/scene — no UI text
    cover: "https://images.launchbox-app.com/ef51e342-83bf-4eaf-a36d-8b6c3bf48c2f.png",
    entries: [
      {
        // entryId: 0 → referenced by Mar 12 day entry
        text: "First proper session. The RGB cable makes such a difference — colours are deep and clean on the CRT, no dot crawl at all. The game opens slow and I mean that in the best way, it's clearly not in a rush to explain anything. There's this weight to the world that you don't really get from modern games. The combat is turn-based with this combo system where you spend AP hitting different buttons, simple on the surface but I can tell it opens up. Already know this is going to be a long one.",
        tags: ["First Session", "CRT"],
        gallery: [
          "https://images.launchbox-app.com/ef51e342-83bf-4eaf-a36d-8b6c3bf48c2f.png",
          "https://images.launchbox-app.com/925e2983-eb49-43b7-996e-2073914c51a5.png",
          "https://images.launchbox-app.com/3f2f7ed2-b34f-424d-90b9-0ef376de8531.png",
        ],
      },
      {
        // entryId: 1 → referenced by Mar 16 day entry — no gallery (short session, didn't screenshot)
        text: "Short one tonight. Made it to Lahan village and did the opening section there. The dialogue is dense — this is clearly a game that expects you to pay attention. Had to look up how one of the early puzzles worked but I don't feel bad about it, the game gives you nothing. The combat is starting to click though, getting the AP combos to land properly feels satisfying.",
        tags: ["Progress"],
        gallery: [],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Day entries
//
// Sorted oldest → newest. Track relies on this order for its circles.
// games[] here contains only { gameId, entryId } references — look up the
// full game record and its entry by joining against the games list above.
// ─────────────────────────────────────────────────────────────────────────────

export const dayEntries = [
  {
    dayId: 1,
    date: "2026-03-05T15:24:00.000Z",
    title: "Leeds Gaming Market",
    text: "Phil and Marc came over today for the gaming market downstairs. Finally bought my original PlayStation, got a chipped region-unlocked one so I can play Parasite Eve, Xenogears and all that. I'm gonna have to spend a bit to get them good quality but I've always wanted to play them. I need to get an RGB cable as well as the NTSC games have a mad rainbow looking filter on top, but I've found somewhere that does them and they're back in stock next month. Banging day anyway today, finished off with a Bundo as well 🤌",
    tags: ["Phil", "Marc", "Gaming Market", "Bundo"],
    games: [
      { gameId: 1, entryId: 0 },
      { gameId: 2, entryId: 0 },
    ],
  },
  {
    dayId: 2,
    date: "2026-03-08T20:10:00.000Z",
    title: null,
    text: "Quiet Sunday. Didn't do much today, cooked a big pasta in the afternoon and then just ended up on Xenoblade for most of the evening. Exactly the kind of day you need sometimes — no plans, no pressure, just the game. Chapter 7 delivered.",
    tags: ["Chill", "Sunday"],
    games: [
      { gameId: 1, entryId: 1 },
    ],
  },
  {
    dayId: 3,
    date: "2026-03-12T21:45:00.000Z",
    title: "RGB cable arrived",
    text: "The RGB cable for the PS1 came almost a week early, wasn't expecting it until the weekend. Plugged it straight in and the difference is night and day — the rainbow interference is completely gone and everything looks sharp and saturated, exactly how it should look. Can't believe I nearly just put up with composite. Fired up Xenogears straight away and played for about two hours.",
    tags: ["PS1", "CRT", "RGB"],
    games: [
      { gameId: 3, entryId: 0 },
    ],
  },
  {
    dayId: 4,
    date: "2026-03-16T19:30:00.000Z",
    title: null,
    text: "Got back from work later than planned and didn't have the energy for much. Put Xenogears on for an hour or so, made some progress but mostly just needed to decompress. The CRT warm-up glow is genuinely one of the most relaxing things to sit in front of.",
    tags: ["After Work"],
    games: [
      { gameId: 3, entryId: 1 },
    ],
  },
  {
    dayId: 5,
    date: "2026-03-20T10:00:00.000Z",
    title: "Morning gaming, then dev",
    text: "Started the morning with some Xenoblade before doing anything else, which is always a good sign for the day. Spent the afternoon doing some work on the journal app — got the PWA manifest set up so it can be saved to the home screen properly and opens without the Safari bar. Feels way more like a real app now. Small detail but it matters.",
    tags: ["Dev", "PWA", "Morning Session"],
    games: [
      { gameId: 1, entryId: 2 },
    ],
  },
];
