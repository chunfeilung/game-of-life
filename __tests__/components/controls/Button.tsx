import * as React from "react";
import * as Renderer from "react-test-renderer";
import {Button} from "../../../src/components/controls/Button";

it("executes functions when clicked", () => {
  /* Given */
  let isFunctionExecuted = false;

  const handleOnClick = () => isFunctionExecuted = true;

  const component = Renderer.create(
    <Button id="testButton" label="Push me" onClick={handleOnClick}/>,
  );

  /* When */
  const snapshot = component.toJSON();
  component.root.props.onClick();

  /* Then */
  expect(snapshot).toMatchSnapshot();
  expect(isFunctionExecuted).toBe(true);
});
