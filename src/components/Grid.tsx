import * as React from "react";
import * as Life from "../Life";

export interface IGridProps {
  cells: Life.Grid;
  onMouseDown: (row: number, column: number) => () => void;
}

export const Grid = (props: IGridProps) => {
  /**
   * Render all cells in the grid.
   *
   * @param grid The grid that should be rendered.
   */
  const renderGrid = (grid: Life.Grid): JSX.Element[] => {
    return grid.map((row: boolean[], rowIndex: number) => {
      const rowCells = row.map((cell: boolean, columnIndex: number) => {
        return renderCell(rowIndex, columnIndex, cell);
      });
      return (<tr key={rowIndex}>{rowCells}</tr>);
    });
  };

  /**
   * Render a single cell.
   *
   * @param row    Row of the grid.
   * @param column Column of the grid.
   * @param value  Whether the cell is active or not.
   */
  const renderCell = (row: number,
                      column: number,
                      value: boolean): JSX.Element => {
    const key = row + "_" + column;
    return (
      <td
        id={"cell_" + key}
        key={key}
        className={"cell" + (value ? " -is-active" : "")}
        onMouseDown={props.onMouseDown(row, column)}>
        {value}
      </td>
    );
  };

  return (
    <table className="game-grid">
      <tbody>
      {renderGrid(props.cells)}
      </tbody>
    </table>
  );
};
