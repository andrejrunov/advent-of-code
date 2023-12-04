import { readFileSync } from "../lib/fs.js";
import { sum } from "../lib/math.js";
import assert from "node:assert/strict";

const input = readFileSync(import.meta.url, "./puzzle-input.txt");

function solvePuzzle1() {
  const lines = input.split("\n");
  const numberOfLines = lines.length;

  function isValidPartNumber(
    lineIndex: number,
    partNumber: string,
    partNumberIndex: number
  ) {
    const line = lines[lineIndex];
    const lineLength = line.length;
    const partNumberLength = partNumber.length;
    const previousLineIndex = lineIndex - 1;
    const nextLineIndex = lineIndex + 1;
    const indexOfCharacterBeforePartNumber = partNumberIndex - 1;
    const indexOfCharacterAfterPartNumber = partNumberIndex + partNumberLength;
    const hasAtLeastOneSymbol = /[^.\d]/;

    function adjacentCharactersHaveAtLeastOneSymbol(line: string) {
      const adjacentCharacters = line.substring(
        Math.max(indexOfCharacterBeforePartNumber, 0),
        Math.min(indexOfCharacterAfterPartNumber + 1, lineLength)
      );
      return hasAtLeastOneSymbol.test(adjacentCharacters);
    }

    if (previousLineIndex !== -1) {
      if (adjacentCharactersHaveAtLeastOneSymbol(lines[previousLineIndex])) {
        return true;
      }
    }

    if (indexOfCharacterBeforePartNumber !== -1) {
      if (hasAtLeastOneSymbol.test(line[indexOfCharacterBeforePartNumber])) {
        return true;
      }
    }

    if (indexOfCharacterAfterPartNumber !== lineLength) {
      if (hasAtLeastOneSymbol.test(line[indexOfCharacterAfterPartNumber])) {
        return true;
      }
    }

    if (nextLineIndex !== numberOfLines) {
      if (adjacentCharactersHaveAtLeastOneSymbol(lines[nextLineIndex])) {
        return true;
      }
    }

    return false;
  }

  const partNumbers: number[] = [];
  for (const [index, line] of lines.entries()) {
    const possiblePartNumbers = [...line.matchAll(/\d+/g)];

    const linePartNumbers = possiblePartNumbers
      .filter((possiblePartNumberMatch) => {
        const [possiblePartNumber] = possiblePartNumberMatch;
        const { index: possiblePartNumberIndex } = possiblePartNumberMatch;
        if (typeof possiblePartNumberIndex === "undefined") {
          return false;
        }
        return isValidPartNumber(
          index,
          possiblePartNumber,
          possiblePartNumberIndex
        );
      })
      .map(Number);
    partNumbers.push(...linePartNumbers);
  }
  return sum(partNumbers);
}

const puzzle1Answer = solvePuzzle1();
assert.equal(puzzle1Answer, 557705, "puzzle 1 answer is incorrect");

console.log({
  puzzle1Answer,
});
