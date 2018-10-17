import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import {Slider} from "../../../src/components/controls/Slider";

Enzyme.configure({adapter: new Adapter()});

it("shows the correct speed when initialised", () => {
  /* Given */
  const slider = Enzyme.shallow(<Slider id="slider" value={2} onChange={jest.fn()}/>);

  /* When */
  const actual = slider.find("input").prop("value");

  /* Then */
  expect(actual).toEqual(2);
});

it("shows the correct speed when updated", () => {
  /* Given */
  const slider = Enzyme.shallow(<Slider id="slider" value={3} onChange={jest.fn()}/>);

  /* When */
  slider.find("input").simulate("change", {target: {value: 8}});
  const actual = slider.find("input").prop("value");

  /* Then */
  expect(actual).toEqual(8);
});
