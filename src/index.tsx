import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./components/App";
import {Game} from "./Life";
import "./styles/main.scss";

const game = new Game(60, 60);

// This initialises the game with an R-pentomino, a very simple pattern that
// evolves for quite a large number of iterations before it stabilises. By
// initialising the game using a series of manual flip()s, pressing “Clear” will
// still actually clear the grid.
//
// This behaviour might change in the future if I ever decide to add some
// predefined patterns with interesting properties.
game.flip(28, 29);
game.flip(28, 30);
game.flip(29, 28);
game.flip(29, 29);
game.flip(30, 29);

ReactDOM.render(
  <App game={game}/>,
  document.getElementById("game"),
);
