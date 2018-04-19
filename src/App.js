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
        initialFetch: false,
        data: []
      },
      pollNumber: false
    };
  }
  render() {
    let vis;

    if (this.state.selectedDay === false) {
      vis = <h2>Select a date first</h2>;
    } else if (this.state.triggers.initialFetch) {
      vis = <h2>Loading...</h2>;
    } else {
      vis = <Visualizer triggers={this.state.triggers.data} />;
    }

    return (
      <div>
        <DatePicker
          dates={this.state.dates}
          onSelect={this.onSelectDay}
          parentState={this}
          selectedDay={this.state.selectedDay}
        />
        {vis}
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

  onSelectDay(dayId) {
    this.setState({
      selectedDay: dayId
    });

    if (this.state.triggers.initialFetch === false) {
      this.setState({
        triggers: {
          intitialFetch: true
        }
      });
    }

    if (this.state.pollNumber !== false) {
      clearInterval(this.state.pollNumber);
    }
    const updater = async () => {
      function generateRandom() {
        let array = [];
        for (let hour = 0; hour < 24; hour++) {
          for (let minutes = 0; minutes < 60; minutes += 60) {
            array.push({
              time: `${hour}:${minutes}`,
              triggers: Math.random()
            });
          }
        }
        return array;
      }
      /*
      const apiUrl = process.env.REACT_APP_API_HOST;
      const response = await fetch(`${apiUrl}/days/${dayId}`);
      const day = await response.json();
      */
      const day = generateRandom();

      this.setState({
        triggers: {
          intitialFetch: false,
          data: day
        }
      });
    };

    const pollNumber = setInterval(updater, 2000);
    this.setState({
      pollNumber
    });
    updater();
  }

  componentWillUnmount() {
    clearInterval(this.state.pollNumber);
  }
}

export default App;
