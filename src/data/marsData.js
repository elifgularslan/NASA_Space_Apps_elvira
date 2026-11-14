export const marsData = {
  id: "mars",
  title: "Mars: The Silent Explorers",
  subtitle: "Rovers and helicopters resting beneath the red Martian dust.",
  themeColor: "#f97316",
  scenes: [
    {
      sceneId: "mars-1",
      title: "Jezero Crater Dunes",
      backgroundImage: "https://images-assets.nasa.gov/image/PIA26243/PIA26243~orig.jpg",
      objects: [
        {
          id: "ingenuity",
          name: "Ingenuity Helicopter (Ginny)",
          clue: "I was built for 5 flights, soared 72 times, and now rest on the dunes with a broken blade.",
          xPercent: 52,
          yPercent: 58,
          status: "Partially Active (Weather Station)",
          story: "Hey explorer! You found me! Everyone doubted a helicopter could fly in Mars' super-thin atmosphere. I proved them wrong 72 times! My rotor blade broke on my final landing in 2024, so I can't fly anymore, but my computer still wakes up to record data.",
          scienceFact: "First powered, controlled aircraft flight on another planet in human history.",
          nasaLink: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/"
        }
      ]
    }
  ]
};