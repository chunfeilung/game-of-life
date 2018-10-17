import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import * as Renderer from "react-test-renderer";
import {Grid} from "../../src/components/Grid";
import * as Life from "../../src/Life";

Enzyme.configure({adapter: new Adapter()});

const grid: Life.Grid = [
  [true, true, true],
  [false, false, false],
  [true, false, true],
  [false, true, false],
];

it("correctly renders a small grid", () => {
  /* Given */
  const component = Renderer.create(
    <Grid cells={grid} onMouseDown={jest.fn()}/>,
  );

  /* When */
  const snapshot = component.toJSON();

  /* Then */
  expect(snapshot).toMatchSnapshot();
});

it("provides the cell’s coordinate to handler", () => {
  /* Given */
  // We define two variables. Values should be assigned later
  let row: number = null;
  let col: number = null;

  // This function will set the variables above
  const handleOnMouseDown = (y: number, x: number) => () => {
    row = y;
    col = x;
  };

  const component = Enzyme.shallow(
    <Grid cells={grid} onMouseDown={handleOnMouseDown}/>,
  );

  /* When */
  // Clicking the third cell on the second row
  const cell = component.find("#cell_1_2");
  cell.simulate("mouseDown");

  /* Then */
  // Variables should have been set to values that correspond with the
  // coordinates of the clicked cell
  expect(row).toBe(1);
  expect(col).toBe(2);
});
