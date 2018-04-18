import React, { Component } from "react";

export default class Visualizer extends Component {
  render() {
    const { selectedDay, fetching, triggers } = this.props;
    if (selectedDay === false) {
      return <h2>Select a date first</h2>;
    }
    if (fetching) {
      return <h2>Loading...</h2>;
    }

    return (
      <ul>
        {triggers.map(trigger => <li key={trigger.id}>{trigger.time}</li>)}
      </ul>
    );
  }
}
