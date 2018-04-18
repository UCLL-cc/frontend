import React, { Component } from "react";
import DatePicker from "./DatePicker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    alert("Selected " + dayId);
    /*
    const apiUrl = process.env.REACT_APP_API_HOST;
    this.setState({
      triggers: {
        fetching: true,
        data: []
      }
    });

    const response = await fetch(`${apiUrl}/triggers/${dayId}`);
    const triggers = await response.json();

    this.setState({
      triggers: {
        fetching: false,
        data: triggers
      }
    });
    */
  }
}

export default App;
