import PuzzleSolution from './PuzzleSolution';

const Solution = class MRS implements PuzzleSolution<number> {
  private mrs: MatrixRangeSum;
  private topLeft: number[];
  private bottomRight: number[];
  private prefixSumByRowMatrix: number[][];
  private prefixSumMatrix: number[][];

  constructor(mrs: MatrixRangeSum, range: number[][]) {
    this.mrs = mrs;
    this.topLeft = range[0];
    this.bottomRight = range[1];
    // prefix by row is built for betterSolution
    this.prefixSumByRowMatrix = this.buildPrefixSumByRowMatrix();
    // prefix by row & column is built for optimalSolution
    this.prefixSumMatrix = this.buildPrefixSumMatrix();
  }

  private buildPrefixSumByRowMatrix(): number[][] {
    const matrix: number[][] = this.mrs.get();
    const prefixSumMatrix: number[][] = [];
    for (let row = 0; row < this.mrs.rows(); row++) {
      prefixSumMatrix.push([]);
      prefixSumMatrix[row].push(matrix[row][0]);
      for (let col = 1; col < this.mrs.cols(); col++) {
        prefixSumMatrix[row].push(
          prefixSumMatrix[row][col - 1] + matrix[row][col]
        );
      }
    }
    return prefixSumMatrix;
  }

  private buildPrefixSumMatrix(): number[][] {
    const prefixSumMatrix: number[][] = [];
    prefixSumMatrix.push([]);
    for (let col = 0; col < this.mrs.cols(); col++) {
      prefixSumMatrix[0].push(this.getPrefixByRow(0, col));
      for (let row = 1; row < this.mrs.rows(); row++) {
        prefixSumMatrix[row] = prefixSumMatrix[row] || [];
        prefixSumMatrix[row].push(
          prefixSumMatrix[row - 1][col] + this.getPrefixByRow(row, col)
        );
      }
    }
    return prefixSumMatrix;
  }

  private value(matrix: number[][], row: number, col: number): number {
    if (row < 0 || col < 0) {
      return 0;
    }
    return matrix[row][col];
  }

  private get(row: number, col: number): number {
    return this.value(this.mrs.get(), row, col);
  }

  private getPrefixByRow(row: number, col: number): number {
    return this.value(this.prefixSumByRowMatrix, row, col);
  }

  private getPrefix(row: number, col: number): number {
    return this.value(this.prefixSumMatrix, row, col);
  }

  bruteForceSolution(): number {
    // time complexity: O(n^2)
    let sum = 0;
    for (let row = this.topLeft[0]; row <= this.bottomRight[0]; row++) {
      for (let col = this.topLeft[1]; col <= this.bottomRight[1]; col++) {
        sum += this.get(row, col);
      }
    }
    return sum;
  }

  betterSolution(): number {
    // time complexity: O(n)
    // requires O(n^2) at initialization
    let sum = 0;
    // sum is equal to range-sum
    // ( fixed row, top-left-col minus bottom-right-col )
    // range-rum by row behaves just like a regular array
    for (let row = this.topLeft[0]; row <= this.bottomRight[0]; row++) {
      sum += this.getPrefixByRow(row, this.bottomRight[1]);
      sum -= this.getPrefixByRow(row, this.topLeft[1] - 1);
    }
    // solution is the sum of range-sums
    return sum;
  }

  optimalSolution(): number {
    // time complexity: O(1)
    // requires O(n^2) at initialization

    // applying range-sum by column after range-sum by row
    // effectively yields the sum from 0,0 for every cell.
    // full-area is value at bottom-right cell
    let sum: number = this.getPrefix(this.bottomRight[0], this.bottomRight[1]);

    // if top-left is has an offset-x greater than 0,
    // then the solution must subtract left-area.
    sum -= this.getPrefix(this.topLeft[0] - 1, this.bottomRight[1]);

    // if top-left is has an offset-x greater than 0,
    // then the solution must subtract above-area.
    sum -= this.getPrefix(this.bottomRight[0], this.topLeft[1] - 1);

    // if left-area and above-area exist, then
    // there is an intersection between both areas
    // which will be subtracted twice from full-area.
    // The intersection must be added to compensate.
    sum += this.getPrefix(this.topLeft[0] - 1, this.topLeft[1] - 1);

    return sum;
  }
};

export default class MatrixRangeSum {
  // this problem is also known as image-integral
  // space complexity: O(3n^2)
  private matrix: Array<Array<number>>;
  private sizeOfRows: number;
  private sizeOfCols: number;

  constructor(matrix: number[][]) {
    this.matrix = Array.from(matrix);
    this.sizeOfRows = this.matrix.length;
    this.sizeOfCols = this.matrix[0].length;
  }

  get(): Array<Array<number>> {
    return this.matrix;
  }

  rows(): number {
    return this.sizeOfRows;
  }

  cols(): number {
    return this.sizeOfCols;
  }

  inRange(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): PuzzleSolution<number> {
    return new Solution(this, [
      [x1, y1],
      [x2, y2],
    ]);
  }
}
