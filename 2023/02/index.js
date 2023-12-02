class Game {
  /**
   * @type {Reveal[]}
   */
  reveals = [];

  /**
   * @type {number}
   */
  id;

  /**
   * @param {typeof CONSTRAINTS} contraints
   */
  isPossible(contraints) {
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
    /** @type {Map<Color, number>} */
    const minimumPossibleGame = new Map();

    for (const { numberOfCubesByColor } of this.reveals) {
      for (const [color, numberOfCubes] of numberOfCubesByColor) {
        if (!minimumPossibleGame.has(color)) {
          minimumPossibleGame.set(color, numberOfCubes);
        } else {
          minimumPossibleGame.set(
            color,
            Math.max(minimumPossibleGame.get(color), numberOfCubes)
          );
        }
      }
    }
    let minimumPossiblePower = 1;

    for (const [color, number] of minimumPossibleGame) {
      minimumPossiblePower *= number;
    }

    return minimumPossiblePower;
  }

  /**
   * @param {string} gameString
   */
  static fromString(gameString) {
    const parsedString = gameString.match(/^\s*Game (\d+): (.*)$/);
    if (!parsedString) {
      return null;
    }
    const game = new Game();
    game.id = Number(parsedString[1]);
    game.reveals = parsedString[2].split(";").map(Reveal.fromString);
    return game;
  }
}

class Reveal {
  /**
   * @type {Map<Color, number>}
   */
  numberOfCubesByColor = new Map();

  /**
   * @param {string} revealString
   */
  static fromString(revealString) {
    const reveal = new Reveal();
    const cubeStrings = revealString.split(",");
    cubeStrings.forEach((cubeString) => {
      const parsedString = cubeString.match(/\s*(\d+)\s*(\D+)\s*/);
      if (parsedString) {
        const color = Color[parsedString[2].toUpperCase()];
        reveal.numberOfCubesByColor.set(color, Number(parsedString[1]));
      }
    });
    return reveal;
  }
}

const Color = {
  RED: 1,
  GREEN: 2,
  BLUE: 3,
};

const CONSTRAINTS = {
  [Color.RED]: 12,
  [Color.GREEN]: 13,
  [Color.BLUE]: 14,
};

/**
 * @param {string} input
 * @returns {Game[]}
 */
function parseInput(input) {
  return input.split("\n").filter(Boolean).map(Game.fromString);
}

/**
 * @param {Number[]} array
 * @param {(object) => number} numberGetter
 */
function sum(array, numberGetter) {
  return array.reduce((result, object) => result + numberGetter(object), 0);
}

/**
 * @param {Game[]} games
 * @param {typeof CONSTRAINTS} contraints
 */
function solvePossibleGames(games, contraints) {
  const possibleGames = games.filter((game) => game.isPossible(contraints));
  if (!possibleGames) {
    return 0;
  }
  return sum(possibleGames, (possibleGame) => possibleGame.id);
}

/**
 * @param {Game[]} games
 */
function solveMinimumPossibleGames(games) {
  return sum(games, (game) => game.getMinimumPossiblePower());
}

const inputPath = require("path").resolve(__dirname, "./puzzle-input.txt");
const games = parseInput(require("fs").readFileSync(inputPath).toString());

console.log(solvePossibleGames(games, CONSTRAINTS));
console.log(solveMinimumPossibleGames(games));
