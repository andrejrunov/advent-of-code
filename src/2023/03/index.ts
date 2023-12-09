import { readFileSync } from "../lib/fs.js";
import { sum } from "../lib/math.js";
import assert from "node:assert/strict";

const input = readFileSync(import.meta.url, "./puzzle-input.txt");
const lines = input.split("\n");
const numberOfLines = lines.length;

function validatePartNumber(
  lineIndex: number,
  partNumber: string,
  partNumberIndex: number,
) {
  const line = lines[lineIndex];
  const lineLength = line.length;
  const partNumberLength = partNumber.length;
  const previousLineIndex = lineIndex - 1;
  const nextLineIndex = lineIndex + 1;
  const indexOfCharacterBeforePartNumber = partNumberIndex - 1;
  const indexOfCharacterAfterPartNumber = partNumberIndex + partNumberLength;
  const hasAtLeastOneSymbol = /[^.\d]/;
  const gearSymbols = /\*/g;

  const possibleAdjacentGears: GearMatrix = new GearMatrix();
  let isValid = false;

  function addPossibleAdjacentGears(
    adjacentCharacters: string,
    lineIndex: number,
    startIndex: number,
  ) {
    const gearSymbolsMatches = adjacentCharacters.matchAll(gearSymbols);
    for (const { index } of gearSymbolsMatches) {
      if (typeof index !== "undefined") {
        possibleAdjacentGears.add(
          lineIndex,
          startIndex + index,
          Number(partNumber),
        );
      }
    }
  }

  function checkAdjacentLine(lineIndex: number) {
    const startIndex = Math.max(indexOfCharacterBeforePartNumber, 0);
    const endIndex = Math.min(indexOfCharacterAfterPartNumber + 1, lineLength);
    const adjacentCharacters = lines[lineIndex].substring(startIndex, endIndex);

    if (hasAtLeastOneSymbol.test(adjacentCharacters)) {
      isValid = true;
      addPossibleAdjacentGears(adjacentCharacters, lineIndex, startIndex);
    }
  }

  function checkAdjacentCharacter(indexOfCharacter: number) {
    const adjacentCharacter = line[indexOfCharacter];
    if (!isValid && hasAtLeastOneSymbol.test(adjacentCharacter)) {
      isValid = true;
      addPossibleAdjacentGears(adjacentCharacter, lineIndex, indexOfCharacter);
    }
  }

  if (previousLineIndex !== -1) {
    checkAdjacentLine(previousLineIndex);
  }

  if (indexOfCharacterBeforePartNumber !== -1) {
    checkAdjacentCharacter(indexOfCharacterBeforePartNumber);
  }

  if (indexOfCharacterAfterPartNumber !== lineLength) {
    checkAdjacentCharacter(indexOfCharacterAfterPartNumber);
  }

  if (nextLineIndex !== numberOfLines) {
    checkAdjacentLine(nextLineIndex);
  }

  return { isValid, possibleAdjacentGears };
}

function findPartNumbers() {
  const partNumbers: number[] = [];
  const possibleGears: GearMatrix = new GearMatrix();
  for (const [index, line] of lines.entries()) {
    const possiblePartNumbers = [...line.matchAll(/\d+/g)];

    const linePartNumbers = possiblePartNumbers
      .filter((possiblePartNumberMatch) => {
        const [possiblePartNumber] = possiblePartNumberMatch;
        const { index: possiblePartNumberIndex } = possiblePartNumberMatch;
        if (typeof possiblePartNumberIndex === "undefined") {
          return false;
        }
        const { isValid, possibleAdjacentGears } = validatePartNumber(
          index,
          possiblePartNumber,
          possiblePartNumberIndex,
        );
        if (isValid) {
          possibleGears.mergeWith(possibleAdjacentGears);
        }
        return isValid;
      })
      .map(Number);
    partNumbers.push(...linePartNumbers);
  }

  return {
    partNumbers,
    possibleGears,
  };
}

// Puzzle 1:

function solvePuzzle1() {
  const { partNumbers } = findPartNumbers();
  return sum(partNumbers);
}

// Puzzle 2:

class GearMatrix {
  map: Map<number, Map<number, Gear>> = new Map();

  add(lineIndex: number, index: number, adjacentPartNumber: number) {
    let line = this.map.get(lineIndex);
    if (!line) {
      line = new Map();
      this.map.set(lineIndex, line);
    }
    let gear = line.get(index);
    if (!gear) {
      gear = new Gear();
      line.set(index, gear);
    }
    gear.adjacentPartNumbers.push(adjacentPartNumber);
  }

  forEachGear(
    callback: (gear: Gear, lineIndex: number, index: number) => void,
  ) {
    for (const [lineIndex, gears] of this.map.entries()) {
      for (const [index, gear] of gears.entries()) {
        callback(gear, lineIndex, index);
      }
    }
  }

  mergeWith(otherGearMatrix: GearMatrix) {
    otherGearMatrix.forEachGear((gear, lineIndex, index) => {
      gear.adjacentPartNumbers.forEach((adjacentPartNumber) =>
        this.add(lineIndex, index, adjacentPartNumber),
      );
    });
  }
}

class Gear {
  adjacentPartNumbers: number[] = [];

  isValid() {
    return this.adjacentPartNumbers.length === 2;
  }

  get ratio() {
    return (
      this.isValid() &&
      this.adjacentPartNumbers[0] * this.adjacentPartNumbers[1]
    );
  }
}

function findGears() {
  const { possibleGears } = findPartNumbers();
  const gears: Gear[] = [];
  possibleGears.forEachGear((gear) => {
    if (gear.isValid()) {
      gears.push(gear);
    }
  });
  return gears;
}

function solvePuzzle2() {
  return sum(findGears().map((gear) => gear.ratio));
}

const puzzle1Answer = solvePuzzle1();
assert.equal(puzzle1Answer, 557705, "puzzle 1 answer is incorrect");

const puzzle2Answer = solvePuzzle2();
assert.equal(puzzle2Answer, 84266818, "puzzle 2 answer is incorrect");

console.log({
  puzzle1Answer,
  puzzle2Answer,
});
