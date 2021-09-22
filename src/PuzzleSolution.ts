export default interface PuzzleSolution<Type> {
  bruteForceSolution: () => Type;
  betterSolution: () => Type;
  optimalSolution: () => Type;
}
