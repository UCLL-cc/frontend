import React, { Component } from "react";
import DatePicker from "./DatePicker";
import Visualizer from "./Visualizer";
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
      const apiUrl = process.env.REACT_APP_API_HOST;
      const response = await fetch(`${apiUrl}/days/${dayId}`);
      const day = await response.json();

      const triggerMap = new Map();
      day.triggers.forEach(trigger => {
        const momentObj = moment(trigger.time, moment.HTML5_FMT.TIME_MS);
        const hour = momentObj.hour();
        const minute = Math.floor(momentObj.minute() / 5) * 5;
        const time = `${hour}:${minute}`;
        if (!triggerMap.has(time)) {
          triggerMap.set(time, 0);
        }
        triggerMap.set(time, triggerMap.get(time) + 1);
      });

      const triggers = Array.from(triggerMap.entries()).map(([key, value]) => {
        return {
          time: key,
          triggers: value
        };
      });

      this.setState({
        triggers: {
          intitialFetch: false,
          data: triggers
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
