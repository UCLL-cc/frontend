import React, { Component } from "react";
import DatePicker from "./DatePicker";
import Visualizer from "./Visualizer";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: false,
      dates: {
        fetching: false,
        data: []
      },
      triggers: {
        fetching: false,
        data: []
      }
    };
  }
  render() {
    return (
      <div>
        <DatePicker
          dates={this.state.dates}
          onSelect={this.onSelectDay}
          parentState={this}
          selectedDay={this.state.selectedDay}
        />
        <Visualizer
          selectedDay={this.state.selectedDay}
          fetching={this.state.triggers.fetching}
          triggers={this.state.triggers.data}
        />
      </div>
    );
  }

  async componentDidMount() {
    const apiUrl = process.env.REACT_APP_API_HOST;
    this.setState({
      dates: {
        fetching: false,
        data: []
      }
    });

    const response = await fetch(`${apiUrl}/days/`);
    const days = await response.json();

    this.setState({
      dates: {
        fetching: false,
        data: days
      }
    });
  }

  async onSelectDay(dayId) {
    const apiUrl = process.env.REACT_APP_API_HOST;
    this.setState({
      selectedDay: dayId,
      triggers: {
        fetching: true,
        data: []
      }
    });

    const response = await fetch(`${apiUrl}/days/${dayId}`);
    const day = await response.json();
    this.setState({
      triggers: {
        fetching: false,
        data: day.triggers
      }
    });
  }
}

export default App;
