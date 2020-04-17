import React, { Component } from "react";

class FieldSet extends Component {
  state = {
    currentlySelected: "",
  };

  componentDidMount() {
    const defaultValue = this.props.defaultValue;
    const currentlySelected = defaultValue ? defaultValue : "";
    this.setState({ currentlySelected });
  }

  handleChange = ({ currentTarget }) => {
    this.setState({ currentlySelected: currentTarget.value });
  };

  render() {
    const { legendLabel, items } = this.props;
    return (
      <div className="form-entry">
        <fieldset>
          <legend>{legendLabel}</legend>
          {items.map((item) => {
            return (
              <div key={item.label}>
                <input
                  id={item.label}
                  type="radio"
                  value={item.value}
                  checked={item.value === this.state.currentlySelected}
                  onChange={this.handleChange}
                />
                <label htmlFor={item.label}>{item.label}</label>
              </div>
            );
          })}
        </fieldset>
      </div>
    );
  }
}

export default FieldSet;
