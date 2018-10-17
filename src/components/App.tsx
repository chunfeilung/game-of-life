import * as React from "react";
import * as Life from "../Life";
import {Button} from "./controls/Button";
import {Slider} from "./controls/Slider";
import {Grid} from "./Grid";

export interface IAppProps {
  game: Life.Game;
}

export interface IAppState {
  cells: Life.Grid;
  isPlaying: boolean;
  animation: NodeJS.Timer;
  speed: number;
}

/**
 * This is the main component.
 */
export class App extends React.Component<IAppProps, IAppState> {
  /**
   * Calculate the interval belonging to a certain speed setting.
   *
   * Intervals should be at least 1 second on the slowest setting, and decently
   * fast on the highest setting.
   *
   * @param speed How fast the simulation should be. Must be between 1 and 10.
   */
  private static determineInterval(speed: number): number {
    return 3000 / (3 * Math.pow(speed, 1.5));
  }

  /**
   * Initial state of the App.
   */
  public state = {
    animation: setInterval(null, 1000),
    cells: this.props.game.cells,
    isPlaying: false,
    speed: 5,
  };

  public render() {
    return (
      <div className="game-app">
        <div className="game-controls">
          <Button id="clearButton" label="Clear" onClick={this.clear}/>
          <Button id="nextButton" label="Next" onClick={this.next}/>
          <Button
            id="playButton"
            label={this.state.isPlaying ? "Pause" : "Play"}
            onClick={this.togglePlay}
          />
          <Slider
            id="slider"
            value={this.state.speed}
            onChange={this.adjustSpeed}
          />
        </div>
        <Grid cells={this.state.cells} onMouseDown={this.flip}/>
      </div>
    );
  }

  /**
   * Reverts the grid to its initial state.
   */
  private clear = (): void => {
    // Pressing “Clear” while the simulation is running should pause it
    if (this.state.isPlaying) {
      this.togglePlay();
    }

    this.props.game.reset();
    this.setState({cells: this.props.game.reset()});
  }

  /**
   * Advance the simulation to the next iteration.
   */
  private next = (): void => {
    // Pressing “Next” while the simulation is running should pause it
    if (this.state.isPlaying) {
      this.togglePlay();
    }
    this.evolve();
  }

  /**
   * Advance the simulation to the next iteration and update the grid.
   */
  private evolve = (): void => {
    this.props.game.evolve();
    this.setState({cells: this.props.game.cells});
  }

  /**
   * Automatically advance the simulation to next iterations.
   */
  private togglePlay = (): void => {
    const isPlaying = !this.state.isPlaying;
    this.setState({isPlaying});

    // Keep in mind that we’ve just updated isPlaying to the new state
    if (isPlaying) {
      this.setState({
        animation: setInterval(
          this.evolve,
          App.determineInterval(this.state.speed),
        ),
      });
    } else {
      clearInterval(this.state.animation);
    }
  }

  /**
   * Toggle a cell’s status between active and inactive.
   *
   * @param row    Row of the cell that should be toggled. Zero-indexed.
   * @param column Column of the cell that should be toggled. Zero-indexed.
   */
  private flip = (row: number, column: number) => () => {
    this.setState({cells: this.props.game.flip(row, column)});
  }

  /**
   * Updates the animation speed.
   *
   * @param speed How fast the animation should be. Must be between 1 and 10.
   */
  private adjustSpeed = (speed: number): void => {
    clearInterval(this.state.animation);
    this.setState({
      animation: setInterval(this.evolve, App.determineInterval(speed)),
      isPlaying: true,
    });
  }
}
