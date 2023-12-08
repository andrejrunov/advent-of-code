import { readFileSync } from "../lib/fs.js";
import { sum } from "../lib/math.js";
import assert from "node:assert/strict";

const input = readFileSync(import.meta.url, "./puzzle-input.txt");
const lines = input.split("\n");

function toStringArray(spaceSeparatedNumbersString: string) {
  return spaceSeparatedNumbersString.split(/\s+/);
}

type CardId = number;

class Card {
  readonly id: CardId;
  readonly winningNumbers: string[];
  readonly numbers: string[];
  readonly isCopy: boolean;

  constructor(
    id: CardId,
    winningNumbers: string[],
    numbers: string[],
    isCopy: boolean = false
  ) {
    this.id = id;
    this.winningNumbers = winningNumbers;
    this.numbers = numbers;
    this.isCopy = isCopy;
  }

  copy() {
    return new Card(this.id, [...this.winningNumbers], [...this.numbers], true);
  }

  get nextCardIdsWon() {
    const result = [];

    let nextCardId = this.id + 1;
    for (const number of this.numbers) {
      if (this.winningNumbers.includes(number)) {
        result.push(nextCardId++);
      }
    }

    return result;
  }

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
    const match = cardString.match(
      /^Card\s+(\d+)\s*:\s+([\d\s]+)\s+\|\s+([\d\s]+)$/
    );
    if (!match) {
      process.exit(1);
    }
    return new Card(
      Number(match[1]),
      toStringArray(match[2]),
      toStringArray(match[3])
    );
  }
}

function solvePuzzle1() {
  return sum(lines.map((line) => Card.fromString(line).points));
}

function solvePuzzle2() {
  const cardMap = new Map<CardId, Card>();
  const cardsToProcess: Card[] = [];
  lines.forEach((line) => {
    const card = Card.fromString(line);
    cardMap.set(card.id, card);
    cardsToProcess.push(card);
  });

  const isValidCardId = (cardId: CardId) => cardMap.has(cardId);
  const allCardIdsWon: CardId[] = [];

  while (cardsToProcess.length) {
    const firstCard = cardsToProcess.shift() as Card;
    const nextCardIdsWon = firstCard.nextCardIdsWon.filter(isValidCardId);
    if (!firstCard.isCopy) {
      allCardIdsWon.push(firstCard.id);
    }
    if (nextCardIdsWon.length) {
      allCardIdsWon.push(...nextCardIdsWon);
      cardsToProcess.unshift(
        ...nextCardIdsWon.map((cardId) => (cardMap.get(cardId) as Card).copy())
      );
    }
  }
  return allCardIdsWon.length;
}

const puzzle1Answer = solvePuzzle1();
const puzzle2Answer = solvePuzzle2();

console.log({ puzzle1Answer, puzzle2Answer });

assert.equal(puzzle1Answer, 20407);
assert.equal(puzzle2Answer, 23806951);
