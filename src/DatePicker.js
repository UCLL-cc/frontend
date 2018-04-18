import React, { Component } from "react";

export default class DataPicker extends Component {
  render() {
    const dates = this.props.dates;
    if (dates.fetching) {
      return <h2>Loading ...</h2>;
    }
    return (
      <ul>
        {dates.data.map(date => (
          <li key={date.id}>
            <a
              onClick={this.props.onSelect.bind(
                this.props.parentState,
                date.id
              )}
            >
              {date.date}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}