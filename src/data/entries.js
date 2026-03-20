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
    cover: "https://images.launchbox-app.com/08652ae7-93e9-4b2a-b300-fb41ffb43528.jpg",
    entries: [
      {
        // entryId: 0 → referenced by Mar 5 day entry
        text: "Grinding some more affinity charts, got Patroka's finished and starting on Akhos.",
        tags: ["Grinding", "Switch Family Collective"],
        gallery: [
          "https://images.launchbox-app.com/4b488f82-83f5-4088-a870-9ebe8f5c6c7d.jpg",
        ],
      },
      {
        // entryId: 1 → referenced by Mar 8 day entry
        text: "Finally got through Chapter 7. The story is really picking up now, some of the cutscenes were genuinely great. Mythra is carrying the party at this point.",
        tags: ["Story", "Chapter 7"],
        gallery: [
          "https://images.launchbox-app.com/b7a444fc-f6b3-415c-b270-55b9aab05756.jpg",
        ],
      },
      {
        // entryId: 2 → referenced by Mar 20 day entry
        text: "Finishing off the last few affinity charts. Rex and Pyra are maxed out, just Zeke and Pandoria left. End feels close.",
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
    cover: "https://images.launchbox-app.com/827f545a-d9d9-4a14-8bd0-eacffeae00b2.jpg",
    entries: [
      {
        // entryId: 0 → referenced by Mar 5 day entry
        text: "Started a new save finally, still looks so good man.",
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
    cover: "https://images.launchbox-app.com/02c6d308-669f-4e93-9b5d-57fe76d2c902.jpg",
    entries: [
      {
        // entryId: 0 → referenced by Mar 12 day entry
        text: "First session. Just doing the intro and getting a feel for it. The vibe is immediately different from anything I've played — very dense and serious. Already know this is going to be a long one.",
        tags: ["First Session"],
        gallery: [
          "https://images.launchbox-app.com/ef51e342-83bf-4eaf-a36d-8b6c3bf48c2f.png",
          "https://images.launchbox-app.com/925e2983-eb49-43b7-996e-2073914c51a5.png",
          "https://images.launchbox-app.com/3f2f7ed2-b34f-424d-90b9-0ef376de8531.png",
        ],
      },
      {
        // entryId: 1 → referenced by Mar 16 day entry — no gallery (short session, didn't screenshot)
        text: "Made it to Lahan village. The game really doesn't hold your hand — had to look up one puzzle already but I don't feel bad about it. Combat is clicking now.",
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
    text: "Quiet Sunday evening. Just me and some Xenoblade. Sometimes that's all you need.",
    tags: ["Chill", "Solo"],
    games: [
      { gameId: 1, entryId: 1 },
    ],
  },
  {
    dayId: 3,
    date: "2026-03-12T21:45:00.000Z",
    title: "RGB cable arrived",
    text: "The RGB cable for the PS1 came a week early, absolute result. Booted up Xenogears for the first time and it looks incredible on the CRT. No rainbow filter, totally clean. Worth every penny.",
    tags: ["PS1", "CRT", "RGB"],
    games: [
      { gameId: 3, entryId: 0 },
    ],
  },
  {
    dayId: 4,
    date: "2026-03-16T19:30:00.000Z",
    title: null,
    text: "Short session after work. Nothing special, just unwinding.",
    tags: ["After Work"],
    games: [
      { gameId: 3, entryId: 1 },
    ],
  },
  {
    dayId: 5,
    date: "2026-03-20T10:00:00.000Z",
    title: "PWA day",
    text: "Added the web app manifest and icons so the journal can be saved to the home screen on iPhone. Opens without the Safari bar now, feels way more like a real app. Small thing but makes a big difference to how it feels to use.",
    tags: ["Dev", "PWA"],
    games: [
      { gameId: 1, entryId: 2 },
    ],
  },
];
