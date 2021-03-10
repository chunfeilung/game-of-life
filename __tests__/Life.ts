import {Game, Grid} from "../src/Life";

/**
 * Converts a grid’s boolean representation to a numeric representation.
 *
 * This makes our test assertions a lot more readable.
 *
 * @param grid The Game grid, retrieved via the “cells” property
 */
const convertToNumeric = (grid: Grid): number[][] => {
  return grid.map((rows) => rows.map((cell) => Number(cell)));
};

/**
 * Converts a grid’s numeric representation to a boolean representation.
 *
 * This makes our test setups a lot more readable.
 *
 * @param grid Pattern that should be used to initialise Game
 */
const convertToBoolean = (grid: number[][]): Grid => {
  return grid.map((rows) => rows.map((cell) => Boolean(cell)));
};

it("can initialise an empty life", () => {
  /* Given */
  const life = new Game(5, 8);

  /* When */
  const actual = life.cells;

  /* Then */
  expect(convertToNumeric(actual)).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(life.width).toBe(8);
  expect(life.height).toBe(5);
});

it("can be initialised with a seed", () => {
  /* Given */
  const life = new Game(4, 4, convertToBoolean([
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ]));

  /* When */
  const actual = life.cells;

  /* Then */
  // Note that the seed pattern is applied to the top-left corner
  expect(convertToNumeric(actual)).toEqual([
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

it("can reset life to a blank grid", () => {
  /* Given */
  const life = new Game(3, 3);
  life.flip(1, 1);
  life.flip(2, 2);

  /* When */
  const actual = life.reset();

  /* Then */
  expect(convertToNumeric(actual)).toEqual([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
});

it("can reset life to seed", () => {
  /* Given */
  const life = new Game(4, 4, convertToBoolean([
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ]));
  life.flip(0, 0);

  /* When */
  const actual = life.reset();

  /* Then */
  expect(convertToNumeric(actual)).toEqual([
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

it("can flip cells in the life", () => {
  /* Given */
  const life = new Game(5, 8);

  /* When */
  life.flip(1, 1);
  life.flip(2, 2);
  life.flip(2, 4);
  const actual = life.cells;

  /* Then */
  expect(convertToNumeric(actual)).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
});

describe("evolution of some popular patterns", () => {
  // Still lifes are stable between iterations, meaning that calling evolve()
  // shouldn’t result in any changes.
  it("can evolve still lifes", () => {
    /* Given */
    const life = new Game(5, 5);
    life.flip(1, 2);
    life.flip(2, 1);
    life.flip(2, 3);
    life.flip(3, 2);

    /* When */
    const before = life.cells;
    const after = life.evolve();

    /* Then */
    expect(before).toEqual(after);
    expect(convertToNumeric(after)).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  describe("(literal) still life edge cases", () => {
    it.each([
      // Nicely centered
      [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
        convertToBoolean([
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ]),
      ],
      // Touching top border
      [
        [0, 1],
        [0, 2],
        [1, 1],
        [1, 2],
        convertToBoolean([
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]),
      ],
      // Touching right border
      [
        [1, 2],
        [1, 3],
        [2, 2],
        [2, 3],
        convertToBoolean([
          [0, 0, 0, 0],
          [0, 0, 1, 1],
          [0, 0, 1, 1],
          [0, 0, 0, 0],
        ]),
      ],
      // Touching bottom border
      [
        [2, 1],
        [2, 2],
        [3, 1],
        [3, 2],
        convertToBoolean([
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
        ]),
      ],
      // Touching left border
      [
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
        convertToBoolean([
          [0, 0, 0, 0],
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
        ]),
      ],
      // Touching top-left corner
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        convertToBoolean([
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]),
      ],
    ])(
      "can evolve blocks", (cell1: number[],
                            cell2: number[],
                            cell3: number[],
                            cell4: number[],
                            expected: Grid) => {
        /* Given */
        const life = new Game(4, 4);
        life.flip(cell1[0], cell1[1]);
        life.flip(cell2[0], cell2[1]);
        life.flip(cell3[0], cell3[1]);
        life.flip(cell4[0], cell4[1]);
        const before = life.cells;

        /* When */
        const after = life.evolve();

        /* Then */
        expect(before).toEqual(expected);
        expect(after).toEqual(expected);
      },
    );
  });

  // Oscillators are essentially looping animations. We only test two patterns
  // here that revert back to their initial state after only two iterations.
  describe("oscillators", () => {
    it("can evolve blinkers", () => {
      /* Given */
      const life = new Game(5, 5);
      life.flip(1, 2);
      life.flip(2, 2);
      life.flip(3, 2);
      const initial = life.cells;

      /* When */
      const afterOneStep = life.evolve();
      const afterTwoSteps = life.evolve();

      /* Then */
      expect(initial).toEqual(convertToBoolean([
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ]));
      expect(afterOneStep).toEqual(convertToBoolean([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]));
      expect(afterTwoSteps).toEqual(initial);
    });

    it("can evolve toads", () => {
      /* Given */
      const life = new Game(6, 6);
      life.flip(2, 2);
      life.flip(2, 3);
      life.flip(2, 4);
      life.flip(3, 1);
      life.flip(3, 2);
      life.flip(3, 3);
      const initial = life.cells;

      /* When */
      const afterOneStep = life.evolve();
      const afterTwoSteps = life.evolve();

      /* Then */
      expect(initial).toEqual(convertToBoolean([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]));
      expect(afterOneStep).toEqual(convertToBoolean([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]));
      expect(afterTwoSteps).toEqual(initial);
    });
  });

  // Spaceships have the ability to move themselves over the grid
  it("can evolve spaceships", () => {
    /* Given */
    const life = new Game(6, 6);
    life.flip(3, 1);
    life.flip(3, 2);
    life.flip(3, 3);
    life.flip(2, 3);
    life.flip(1, 2);

    /* When */
    const actual = life.evolve();

    /* Then */
    expect(convertToNumeric(actual)).toEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });
});

describe("incorrect usage", () => {
  it("cannot be created with a non-positive number of rows", () => {
    /* Given, Then */
    expect(() => {
      const life = new Game(0, 1);
    }).toThrow();
  });

  it("cannot be created with a non-positive number of columns", () => {
    /* Given, Then */
    expect(() => {
      const life = new Game(1, 0);
    }).toThrow();
  });

  it("cannot be created with empty seed", () => {
    /* Given, Then */
    expect(() => {
      const life = new Game(1, 1, [[]]);
    }).toThrow();
  });

  it("cannot be created with oversized seed", () => {
    /* Given, Then */
    expect(() => {
      const life = new Game(1, 1, convertToBoolean([
        [1, 1],
        [1, 1],
      ]));
    }).toThrow();
  });
});
