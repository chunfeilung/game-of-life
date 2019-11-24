/**
 * A grid holds information about a rectangular group of cells
 */
export type Grid = boolean[][];

/**
 * Simple, non-vectorised implementation of Conway’s Game of Life (also simply
 * called Life).
 *
 * Life is one of the most well-known examples of cellular automata. It has the
 * power of a universal Turing machine, which means that you could technically
 * use it for practical applications – that’s not what makes it so popular
 * however. Life also happens to be a fascinating simulation that shows how very
 * complex patterns can emerge from just a few simple rules.
 *
 * @example
 * let game = new Game(10, 10);
 * game.flip(1, 1);
 * game.flip(1, 2);
 * game.flip(2, 2);
 * let cells = game.evolve();
 */
export class Game {
  /**
   * Verify that an instance can be created using these parameter values.
   *
   * @param rows    Must be a positive integer.
   * @param columns Must be a positive integer.
   * @param seed    Must be able to contain values. Its size must not exceed
   *                the size of the grid.
   */
  private static checkConstructorParameters(rows: number,
                                            columns: number,
                                            seed: Grid,
  ): void {
    if (rows <= 0 || columns <= 0) {
      throw new Error("Row and column count must be positive integers");
    }

    if (seed !== null) {
      if (seed.length > rows || seed[0].length > columns) {
        throw new Error("Seed does not fit into grid");
      }
      if (seed.length === 0 || seed[0].length === 0) {
        throw new Error("Seed does not contain sufficient data");
      }
    }
  }

  /**
   * First, “blue” representation of the grid.
   */
  private readonly blueGrid: Grid;

  /**
   * Second, “green” representation of the grid.
   */
  private readonly greenGrid: Grid;

  /**
   * The pattern that is used to (re)initialise the grid.
   *
   * The seed pattern is optional, so this attribute can also be null.
   */
  private readonly seed: Grid;

  /**
   * The current representation of the grid.
   *
   * Alternates between the blue and green grid. Changes to individual cells
   * (via flip()) are applied to this grid.
   */
  private currentGrid: Grid;

  /**
   * The representation of the grid in the next iteration.
   *
   * Alternates between the blue and green grid. Changes made by evolving the
   * grid are applied to this grid.
   */
  private nextGrid: Grid;

  /**
   * Create a new instance of Game.
   *
   * @param rows    How many rows the grid should have; must be a positive
   *                integer. Very large values may cause performance issues.
   * @param columns How many columns the grid should have; must be a positive
   *                integer. Very large values may cause performance issues.
   * @param seed    Optional: the pattern used to initialise the grid.
   */
  public constructor(rows: number, columns: number, seed: Grid = null) {
    Game.checkConstructorParameters(rows, columns, seed);

    this.blueGrid = this.initialise(rows, columns);
    this.greenGrid = this.initialise(rows, columns);

    this.seed = seed;

    this.currentGrid = this.blueGrid;
    this.nextGrid = this.greenGrid;

    this.applySeedPattern();
  }

  /**
   * Toggle a cell between its active and inactive state.
   *
   * More specifically, this makes inactive (dead) cells active, and active
   * (alive) cells inactive. Surrounding cells won’t be affected until the next
   * iteration.
   *
   * @see {@link evolve} for advancing the simulation to the next iteration.
   *
   * @param row    Row of the cell that should be flipped. Zero-indexed.
   * @param column Column of the cell that should be flipped. Zero-indexed.
   */
  public flip = (row: number, column: number): Grid => {
    this.currentGrid[row][column] = !this.currentGrid[row][column];

    return this.currentGrid;
  }

  /**
   * Calculate the Game of Game instance’s next iteration.
   */
  public evolve = (): Grid => {
    // There’s a “current” grid and a “next” grid. This updates the “next” grid
    // first, and leaves the “current” grid untouched
    this.currentGrid.forEach((row: boolean[], rowIndex: number) => {
      row.forEach((_, columnIndex: number) => {
        const activeCells = this.countActiveCells(rowIndex, columnIndex);
        this.updateCell(rowIndex, columnIndex, activeCells);
      });
    });

    // until all cells in the “next” grid have been updated. This ensures that
    // clients will never see grids that are only partially updated
    this.switchGrids();

    return this.currentGrid;
  }

  /**
   * Revert the grid to its initial state.
   *
   * Will apply the seed pattern if one was passed during instance construction.
   */
  public reset = (): Grid => {
    this.currentGrid.map((row) => row.fill(false));

    this.applySeedPattern();

    return this.cells;
  }

  /**
   * Create the two-dimensional array that represents the grid.
   *
   * @param rows    How many rows the grid should have.
   * @param columns How many columns the grid should have.
   */
  private initialise = (rows: number, columns: number): Grid => {
    return Array(rows).fill(false).map(() => Array(columns).fill(false));
  }

  /**
   * Add the seed pattern to the grid, starting from the top-left corner.
   *
   * Will silently overwrite any values that were already present.
   */
  private applySeedPattern = (): void => {
    if (this.seed !== null) {
      this.seed.forEach((row: boolean[], rowIndex: number) => {
        row.forEach((cell: boolean, colIndex: number) => {
          this.currentGrid[rowIndex][colIndex] = cell;
        });
      });
    }
  }

  /**
   * The number of columns in the grid.
   */
  public get width(): number {
    return this.currentGrid[0].length;
  }

  /**
   * The number of rows in the grid.
   */
  public get height(): number {
    return this.currentGrid.length;
  }

  /**
   * Retrieve a representation of the complete grid as a two-dimensional array.
   */
  public get cells(): Grid {
    return this.currentGrid;
  }

  /**
   * Count the number of active cells in the direct vicinity of the current
   * cell.
   *
   * Includes the current cell itself!
   *
   * @param row    Row of the current cell.
   * @param column Column of the current cell.
   */
  private countActiveCells = (row: number, column: number): number => {
    let activeCells = 0;
    // Run a 3x3 kernel past every cell
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = column - 1; j <= column + 1; j++) {
        if (i < 0 || j < 0 || i >= this.height || j >= this.width) {
          continue;
        }

        activeCells += Number(this.currentGrid[i][j]);
      }
    }
    return activeCells;
  }

  /**
   * Update a specific cell using a value that depends on the number of active
   * cells in its direct vicinity.
   *
   * @param row         Row of the cell that will be updated.
   * @param column      Column of the cell that will be updated.
   * @param activeCells Number of active cells in and around the current cell.
   */
  private updateCell = (row: number,
                        column: number,
                        activeCells: number): void => {
    // Conditions are very good, so the cell becomes alive (if it isn’t already)
    if (activeCells === 3) {
      this.nextGrid[row][column] = true;
      // Everything’s stable, nothing changes
    } else if (activeCells === 4) {
      this.nextGrid[row][column] = this.currentGrid[row][column];
      // Under- or overpopulation kills the cell
    } else {
      this.nextGrid[row][column] = false;
    }
  }

  /**
   * Makes the next iteration’s grid the current one.
   *
   * The current grid will be reused as the next iteration’s “next” grid.
   */
  private switchGrids = (): void => {
    const next = this.nextGrid;
    this.nextGrid = this.currentGrid;
    this.currentGrid = next;
  }
}
