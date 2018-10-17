/**
 * @jest-environment jsdom
 */

import {configure, mount, ReactWrapper} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import * as Renderer from "react-test-renderer";
import {App} from "../../src/components/App";
import {Game, Grid} from "../../src/Life";

configure({adapter: new Adapter()});

const seed: Grid = [
  [false, false, false, false, false],
  [false, false, true, false, false],
  [false, true, false, false, false],
  [false, false, true, true, false],
  [false, false, false, false, false],
];

const expectToSeeIterationPattern0 = (app: ReactWrapper) => {
  expectToSeeIterationPattern(seed, app);
};

const expectToSeeIterationPattern1 = (app: ReactWrapper) => {
  expectToSeeIterationPattern([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, false, true, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ], app);
};

const expectToSeeIterationPattern2 = (app: ReactWrapper) => {
  expectToSeeIterationPattern([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ], app);
};

const expectToSeeIterationPattern = (expected: Grid, app: ReactWrapper) => {
  for (let i = 0, height = expected.length; i < height; i++) {
    for (let j = 0, width = expected[i].length; j < width; j++) {
      const className = app.find(`#cell_${i}_${j}`).prop("className");
      if (expected[i][j]) {
        expect(className).toBe("cell -is-active");
      } else {
        expect(className).toBe("cell");
      }
    }
  }
};

// This merely verifies that the app still looks the same
it("renders correctly", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = Renderer.create(<App game={game}/>);

  /* When */
  const snapshot = app.toJSON();

  /* Then */
  expect(snapshot).toMatchSnapshot();
});

// When we click on some cells to toggle them between their active and inactive
// state, we expect to see this in the UI as well
it("can toggle cells between active and inactive states", () => {
  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);

  /* When */
  // This should change from inactive to active
  app.find("#cell_0_0").simulate("mouseDown");

  // This should change from active to inactive
  app.find("#cell_1_2").simulate("mouseDown");

  /* Then */
  expect(app.find("#cell_0_0").prop("className")).toBe("cell -is-active");
  expect(app.find("#cell_1_2").prop("className")).toBe("cell");
});

// Note that in this case, the initial state is the seed pattern
it("resets the app to its initial state when “Clear” is pressed", () => {
  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);

  // Activate some cells that should be reset
  app.find("#cell_0_0").simulate("mouseDown");
  app.find("#cell_1_2").simulate("mouseDown");

  /* When */
  app.find("#clearButton").hostNodes().simulate("click");

  /* Then */
  expectToSeeIterationPattern0(app);

  expect(app.find("#playButton").hostNodes().text()).toBe("Play");
});

// The game should show the next evolution, but not automatically move on to the
// next one
it("shows the next iteration when the “Next” button is pressed", () => {
  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);

  /* When */
  app.find("#nextButton").hostNodes().simulate("click");

  /* Then */
  expectToSeeIterationPattern1(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Play");
});

// The game should automatically show the second iteration when sufficient time
// has elapsed
it("starts playing when the “Play” button is pressed", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);

  /* When */
  app.find("#playButton").hostNodes().simulate("click");

  jest.advanceTimersByTime(90);
  app.update();

  /* Then */
  expectToSeeIterationPattern1(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Pause");
});

it("starts playing when the slider is moved", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);

  /* When */
  app.find("#slider").hostNodes().simulate("change", {target: {value: 6}});

  jest.advanceTimersByTime(70);
  app.update();

  /* Then */
  expectToSeeIterationPattern1(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Pause");
});

it("plays faster when the speed is increased", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);
  app.find("#playButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);

  /* When */
  app.find("#slider").hostNodes().simulate("change", {target: {value: 8}});
  // Since we’ve increased the speed, we should see the next iteration sooner
  jest.advanceTimersByTime(45);
  app.update();

  /* Then */
  expectToSeeIterationPattern2(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Pause");
});

it("plays slower when the speed is lowered", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);
  app.find("#playButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);

  /* When */
  app.find("#slider").hostNodes().simulate("change", {target: {value: 1}});
  // This is not enough time for the second iteration to show up
  jest.advanceTimersByTime(90);
  app.update();

  /* Then */
  expectToSeeIterationPattern1(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Pause");
});

it("stops playing when the “Pause” button is pressed", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);
  app.find("#playButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);

  /* When */
  app.find("#playButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);
  app.update();

  /* Then */
  expectToSeeIterationPattern1(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Play");
});

it("stops playing when the “Clear” button is pressed", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);
  app.find("#playButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);

  /* When */
  app.find("#clearButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);
  app.update();

  /* Then */
  expectToSeeIterationPattern0(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Play");
});

it("stops playing when the “Next” button is pressed", () => {
  jest.useFakeTimers();

  /* Given */
  const game = new Game(5, 5, seed);
  const app = mount(<App game={game}/>);
  app.find("#playButton").hostNodes().simulate("click");
  jest.advanceTimersByTime(90);

  /* When */
  app.find("#nextButton").hostNodes().simulate("click");
  app.update();

  /* Then */
  // Pressing “Next” stops the simulation, but will still show the next
  // iteration
  expectToSeeIterationPattern2(app);
  expect(app.find("#playButton").hostNodes().text()).toBe("Play");
});
