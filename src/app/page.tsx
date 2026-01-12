"use client";

import { useEffect, useState } from "react";

const Home = () => {
  const [joke, setJoke] = useState<string>("...");

  useEffect(() => {
    fetch("/api/joke")
      .then((res) => res.json())
      .then((data) => setJoke(data.joke));
  }, []);

  return (
    <div>
      <span>Joke: {joke}</span>
    </div>
  );
};

export default Home;
