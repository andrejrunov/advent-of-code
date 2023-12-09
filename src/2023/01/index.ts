import { readFileSync } from "../lib/fs.js";
import { sum } from "../lib/math.js";
import assert from "node:assert/strict";

const input = readFileSync(import.meta.url, "./puzzle-input.txt").split("\n");

// Puzzle 1:

const PUZZLE1_LINE_REG_EXP = /\d/g;

function digitsFinderForPuzzle1(line: string) {
  const digits = line.match(PUZZLE1_LINE_REG_EXP);
  return digits ? digits.map(Number) : [];
}

// Puzzle 2:

const DIGIT_NAMES = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const PUZZLE2_LINE_REG_EXP = new RegExp(`\\d|${DIGIT_NAMES.join("|")}`);

function digitsFinderForPuzzle2(line: string) {
  const digits = [];
  for (let i = 0; i < line.length; i++) {
    const match = line.substring(i).match(PUZZLE2_LINE_REG_EXP);
    if (match) {
      const digitString = match[0];
      const possibleDigitNameIndex = DIGIT_NAMES.indexOf(digitString);
      const digit =
        possibleDigitNameIndex !== -1
          ? possibleDigitNameIndex + 1
          : digitString;
      digits.push(Number(digit));
    }
  }
  return digits;
}

function getCalibrationValue(
  line: string,
  digitsFinder: (line: string) => number[],
) {
  const digits = digitsFinder(line);
  return digits.length ? Number(`${digits[0]}${digits[digits.length - 1]}`) : 0;
}

function solvePuzzle1() {
  return sum(
    input.map((line) => getCalibrationValue(line, digitsFinderForPuzzle1)),
  );
}

function solvePuzzle2() {
  return sum(
    input.map((line) => getCalibrationValue(line, digitsFinderForPuzzle2)),
  );
}

const puzzle1Answer = solvePuzzle1();
const puzzle2Answer = solvePuzzle2();

assert.equal(puzzle1Answer, 54573, "puzzle 1 answer is incorrect");
assert.equal(puzzle2Answer, 54591, "puzzle 2 answer is incorrect");

console.log({
  puzzle1Answer,
  puzzle2Answer,
});
