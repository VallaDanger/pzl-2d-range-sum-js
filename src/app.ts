import PuzzleSolution from './PuzzleSolution';
import MatrixRangeSum from './MatrixRangeSum';

const matrix: number[][] = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];

const mrs: MatrixRangeSum = new MatrixRangeSum(matrix);
const puzzle: PuzzleSolution<number> = mrs.inRange(0, 1, 1, 2);

console.log(puzzle.bruteForceSolution());
console.log(puzzle.betterSolution());
console.log(puzzle.optimalSolution());

export default {puzzle};
