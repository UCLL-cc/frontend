import React, { Component, createRef } from "react";
import * as d3 from "d3";
import "./Visualizer.css";

export default class Visualizer extends Component {
  constructor(props) {
    super(props);

    this.svgRef = createRef();
  }

  render() {
    return <svg ref={this.svgRef} width="1900" height="500" />;
  }

  componentDidMount() {
    this.draw(this.props.triggers);
  }

  componentDidUpdate() {
    this.draw(this.props.triggers);
  }

  draw(triggers) {
    const svg = d3.select(this.svgRef.current);
    // Remove the old
    svg.select("g").remove();

    const margins = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    };
    const dimensions = {
      width: svg.attr("width") - margins.left - margins.right,
      height: svg.attr("height") - margins.top - margins.bottom
    };

    const g = svg
      .append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`);

    // Axis
    const x = d3
      .scaleBand()
      .rangeRound([0, dimensions.width])
      .padding(1 / triggers.length)
      .domain(triggers.map(data => data.time));

    const y = d3
      .scaleLinear()
      .rangeRound([dimensions.height, 0])
      .domain([0, d3.max(triggers.map(data => data.count))]);

    // Draw the axis
    const xAxis = g
      .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${dimensions.height})`)
      .call(d3.axisBottom(x));

    const yAxis = g
      .append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(y).tickSize(1));

    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Frequency");

    // Bars
    g
      .selectAll(".bar")
      .data(triggers)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", data => x(data.time))
      .attr("y", data => y(data.count))
      .attr("width", x.bandwidth())
      .attr("height", data => dimensions.height - y(data.count));
  }
}
