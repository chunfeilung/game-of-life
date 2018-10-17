import * as React from "react";

export interface IButtonProps {
  id: string;
  label: string;
  onClick: () => void;
}

export const Button = (props: IButtonProps) => {
  return (
    <button id={props.id} onClick={props.onClick}>{props.label}</button>
  );
};
