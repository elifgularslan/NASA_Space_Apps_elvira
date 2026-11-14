export const moonData = {
  id: "moon",
  title: "The Moon: Footprints & Mirrors",
  subtitle: "Silent monuments and passive instruments still reflecting our lasers.",
  themeColor: "#38bdf8",
  scenes: [
    {
      sceneId: "moon-1",
      title: "Sea of Tranquility & Hadley Rille",
      backgroundImage: "https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg",
      objects: [
        {
          id: "lrrr",
          name: "Laser Ranging Retroreflector",
          clue: "I need no battery. Shoot a laser at me from Earth, and I'll bounce it right back!",
          xPercent: 45,
          yPercent: 68,
          status: "Active (Passive Instrument)",
          story: "Hello from the dusty lunar surface! Apollo 11 astronauts left me here in 1969. Because I am made of special corner-cube mirrors, scientists on Earth still shoot laser beams at me today to measure the exact distance to the Moon!",
          scienceFact: "Proved that the Moon is slowly drifting away from Earth at about 3.8 cm per year.",
          nasaLink: "https://science.nasa.gov/moon/"
        }
      ]
    }
  ]
};