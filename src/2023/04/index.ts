import { readFileSync } from "../lib/fs.js";
import { sum } from "../lib/math.js";
import assert from "node:assert/strict";

const input = readFileSync(import.meta.url, "./puzzle-input.txt");
const lines = input.split("\n");

function toStringArray(spaceSeparatedNumbersString: string) {
  return spaceSeparatedNumbersString.split(/\s+/);
}

class Card {
  winningNumbers: string[] = [];
  numbers: string[] = [];

  get points() {
    let result = 0;

    for (const number of this.numbers) {
      if (this.winningNumbers.includes(number)) {
        result = result === 0 ? 1 : result * 2;
      }
    }

    return result;
  }

  static fromString(cardString: string): Card {
    const card = new Card();
    const match = cardString.match(
      /^Card\s+\d+:\s+([\d\s]+)\s+\|\s+([\d\s]+)$/
    );
    if (!match) {
      process.exit(1);
    }
    card.winningNumbers = toStringArray(match[1]);
    card.numbers = toStringArray(match[2]);
    return card;
  }
}

function solvePuzzle1() {
  return sum(lines.map((line) => Card.fromString(line).points));
}

const puzzle1Answer = solvePuzzle1();

console.log({ puzzle1Answer });

assert.equal(puzzle1Answer, 20407);
