import * as React from "react";

export interface ISliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
}

export interface ISliderState {
  value: number;
}

export class Slider extends React.Component<ISliderProps, ISliderState> {
  constructor(props: ISliderProps) {
    super(props);
    this.state = {value: props.value};

    this.handleChange = this.handleChange.bind(this);
  }

  public render = () => {
    return (
      <label>
        Speed:
        <input
          id={this.props.id}
          type="range"
          min="1"
          max="10"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </label>
    );
  }

  private handleChange = (event: any) => {
    this.setState({value: event.target.value});
    this.props.onChange(event.target.value);
  }
}
