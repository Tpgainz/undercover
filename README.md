
# Mister White 🎮

"Mister White" is a **fun** and **engaging** game designed to be played with friends or family in real life. It's a guessing game that involves identifying intruders among the players, with a twist of having a mysterious character known as "Mister White."

## 🌟 Version

0.1.0

## 🚀 Features

- 🎲 Playable in real life with a group of friends or family.
- 🧑‍🤝‍🧑 Supports 4 to 10 players.
- 🔄 Multiple rounds of gameplay where players aim to identify the intruders among them.
- 🎭 Unique roles assigned to players: Intruders, Crewmates, and the enigmatic Mister White.
- 💻 Simple and intuitive UI built with a modern tech stack.

## 🛠 Tech Stack

- **Next.js**: Frontend framework.
- **Tailwind CSS**: Styling.
- **Radix UI**: Accessible UI components.
- **TypeScript**: Type-safe code.
- **ESLint & Prettier**: Code quality and formatting.

## 💾 Installation

To get started with "Mister White", clone the repository and install the dependencies:

```bash
git clone https://github.com/tpgainz/misterwhite/
cd misterwhite
npm install
```

## 🎲 Running the Game

Start the development server:
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## 📜 Gameplay Rules

### Overview

- Designed for real-life play.
- Best experienced with a game leader.
- No online multiplayer mode currently available.
- The game progresses in several rounds.

### Goal

🎯 Find the intruders among the players!

### Roles

- 🔴 Intruders: Have a different word than the crewmates
- 🟢 Crewmates: Have the same word but don't know the intruders.
- 🔵 Mister White: Doesn't know the word and is unaware of being Mister White.

### Gameplay

- Players express synonyms of their words each turn.
- The objective is to identify the intruder based on the synonyms given.

### Game Setup

- Minimum of 4 players, maximum of 10.
- Players select a card and receive a word (except Mister White).

### Turns

- The game dictates the start and order of turns.
- Each player expresses a synonym of their word.
- Voting occurs to eliminate a suspected intruder.

### End Game

- The game ends when all intruders or Mister White (if identified and guesses the crewmates' word) are found.

## 🤝 Contributing

Contributions to "Mister White" are welcome! Please read our contributing guidelines to get started.

## 📄 License

This project is licensed under [MIT].
