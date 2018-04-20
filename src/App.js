import React, { Component } from "react";
import DatePicker from "./DatePicker";
import Visualizer from "./Visualizer";
import axios from "axios";
import moment from "moment";

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
        previousDay: false,
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
          initialFetch: true
        }
      });
    }

    if (this.state.pollNumber !== false) {
      clearInterval(this.state.pollNumber);
    }
    const updater = async () => {
      try {
        // If there is a new day, cancel the old
        if (this.state.previousDay !== dayId) {
          if (this.cancel) {
            this.cancel();
          }
        }
        const triggers = await this.getTriggers(dayId);

        this.setState({
          triggers: {
            initialFetch: false,
            previousDay: dayId,
            data: triggers
          }
        });
      } catch (e) {
        if (axios.isCancel(e)) {
          console.error("Thrown by timeout");
        } else {
          throw e;
        }
      }
    };

    updater();
    const pollNumber = setInterval(updater, 2000);
    this.setState({
      pollNumber
    });
  }

  async getTriggers(dayId) {
    const apiUrl = process.env.REACT_APP_API_HOST;
    const response = await axios.get(`${apiUrl}/days/${dayId}/?format=json`, {
      cancelToken: new axios.CancelToken(c => (this.cancel = c))
    });
    const day = response.data;

    return day.triggers;
  }

  componentWillUnmount() {
    clearInterval(this.state.pollNumber);
  }
}

export default App;
