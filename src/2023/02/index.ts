import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLOR = {
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
} as const;

type Color = (typeof COLOR)[keyof typeof COLOR];

class Game {
  reveals: Reveal[] = [];

  id: number;

  constructor(id: number) {
    this.id = id;
  }

  isPossible(contraints: Record<Color, number>) {
    return !this.reveals.some((reveal) => {
      let impossibleReveal = false;

      for (const [color, numberOfCubes] of reveal.numberOfCubesByColor) {
        if (numberOfCubes > contraints[color]) {
          impossibleReveal = true;
          break;
        }
      }
      return impossibleReveal;
    });
  }

  getMinimumPossiblePower() {
    const minimumPossibleGame = new Map<Color, number>();

    for (const { numberOfCubesByColor } of this.reveals) {
      for (const [color, numberOfCubes] of numberOfCubesByColor) {
        if (!minimumPossibleGame.has(color)) {
          minimumPossibleGame.set(color, numberOfCubes);
        } else {
          const existingNumberOfCubes = minimumPossibleGame.get(color);
          if (typeof existingNumberOfCubes === "number") {
            minimumPossibleGame.set(
              color,
              Math.max(existingNumberOfCubes, numberOfCubes)
            );
          }
        }
      }
    }
    let minimumPossiblePower = 1;

    for (const [color, number] of minimumPossibleGame) {
      minimumPossiblePower *= number;
    }

    return minimumPossiblePower;
  }

  static fromString(gameString: string) {
    const parsedString = gameString.match(/^\s*Game (\d+): (.*)$/);
    if (!parsedString) {
      return process.exit(1);
    }
    const game = new Game(Number(parsedString[1]));
    game.reveals = parsedString[2].split(";").map(Reveal.fromString);
    return game;
  }
}

class Reveal {
  numberOfCubesByColor = new Map<Color, number>();

  static fromString(revealString: string) {
    const reveal = new Reveal();
    const cubeStrings = revealString.split(",");
    cubeStrings.forEach((cubeString) => {
      const parsedString = cubeString.match(/\s*(\d+)\s*(\D+)\s*/);
      if (parsedString) {
        const color = parsedString[2] as Color;
        reveal.numberOfCubesByColor.set(color, Number(parsedString[1]));
      }
    });
    return reveal;
  }
}

function parseInput(input: string) {
  return input.split("\n").filter(Boolean).map(Game.fromString);
}

function sum<T>(array: T[], numberGetter: (anObject: T) => number) {
  return array.reduce((result, object) => result + numberGetter(object), 0);
}

type Contraints = Record<Color, number>;

function solvePuzzle1(games: Game[], contraints: Contraints) {
  const possibleGames = games.filter((game) => game.isPossible(contraints));
  if (!possibleGames) {
    return 0;
  }
  return sum(possibleGames, (possibleGame) => possibleGame.id);
}

function solvePuzzle2(games: Game[]) {
  return sum(games, (game) => game.getMinimumPossiblePower());
}

const games = parseInput(
  readFileSync(resolve(__dirname, "./puzzle-input.txt")).toString()
);

console.log(
  solvePuzzle1(games, {
    [COLOR.RED]: 12,
    [COLOR.GREEN]: 13,
    [COLOR.BLUE]: 14,
  })
);
console.log(solvePuzzle2(games));
