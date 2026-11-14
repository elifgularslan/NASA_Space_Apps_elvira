export const deepSpaceData = {
  id: "deepSpace",
  title: "Deep Space: The Endless Voyagers",
  subtitle: "Distant probes drifting into the interstellar dark, carrying messages from Earth.",
  themeColor: "#a855f7",
  scenes: [
    {
      sceneId: "deepspace-1",
      title: "Beyond the Heliosphere",
      backgroundImage: "https://images-assets.nasa.gov/image/PIA17046/PIA17046~orig.jpg",
      objects: [
        {
          id: "voyager1",
          name: "Voyager 1 & The Golden Record",
          clue: "I am the farthest human-made object in the universe, carrying a golden phonograph record.",
          xPercent: 60,
          yPercent: 45,
          status: "Active (Interstellar Mission)",
          story: "Greetings from interstellar space! Launched in 1977, I am now over 24 billion kilometers away from home. Strapped to my side is a Golden Record filled with Earth's music, greetings in 55 languages, and nature sounds—just in case someone out here finds me.",
          scienceFact: "First spacecraft to cross the heliopause and enter interstellar space.",
          nasaLink: "https://science.nasa.gov/mission/voyager/"
        }
      ]
    }
  ]
};