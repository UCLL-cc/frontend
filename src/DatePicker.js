import React, { Component } from "react";
import moment from "moment";

export default class DatePicker extends Component {
  render() {
    const { dates } = this.props;
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
              {this.renderOneDate(date)}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  renderOneDate(date) {
    const dateString = moment(date.date).format("DD/MM/YYYY");
    if (date.id === this.props.selectedDay) {
      return <strong>{dateString}</strong>;
    } else {
      return dateString;
    }
  }
}
