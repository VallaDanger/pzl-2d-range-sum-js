import {expect} from 'chai';
import PuzzleSolution from '../src/PuzzleSolution';
import MatrixRangeSum from '../src/MatrixRangeSum';

describe('MatrixRotation', () => {
  const matrix: number[][] = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
  ];

  const mrs: MatrixRangeSum = new MatrixRangeSum(matrix);
  const puzzle: PuzzleSolution<number> = mrs.inRange(0, 1, 1, 2);

  it('brute-force solution', () => {
    expect(puzzle.bruteForceSolution()).equals(20);
  });
  it('better solution', () => {
    expect(puzzle.betterSolution()).equals(20);
  });
  it('optimal solution', () => {
    expect(puzzle.optimalSolution()).equals(20);
  });
});
