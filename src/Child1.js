import React, { Component } from 'react';
import * as d3 from 'd3';

class Child1 extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      //console.log("componentDidMount (data is): ", this.props.data);
      this.setState({ x_scale: 10 });
    }
    componentDidUpdate() {
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 10, bottom: 30, left: 20 },
        w = 500 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;
  
      var data = this.props.data;

      // Finding average values for each categorical column
      const groupedData = d3.group(data, d => d[this.props.categorical]);
      const averages = Array.from(groupedData.entries()).map(([key, values]) => {
        const averagesObj = { key };
        // Calculate averages for each column
        averagesObj[this.props.numerical] = d3.mean(values, d => d[this.props.numerical])
        return averagesObj;
      });
      console.log(averages)
      const temp_data = averages.map(obj => [obj.key, obj[this.props.numerical]]);
      temp_data.sort((a, b) => {
        const order = ['Thur', 'Fri', 'Sat', 'Sun'];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      });

      console.log(temp_data);
  
      var container = d3
        .select(".child1_svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .select(".g_1")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      // X axis
      var x_data = temp_data.map((item) => item[0]);
      var x_scale = d3
        .scaleBand()
        .domain(x_data)
        .range([margin.left, w])
        .padding(0.2);
  
      container
        .selectAll(".x_axis_g")
        .data([0])
        .join("g")
        .attr("class", "x_axis_g")
        .attr("transform", `translate(0, ${h})`)
        .call(d3.axisBottom(x_scale));
      // Add Y axis
      var y_data = temp_data.map((item) => item[1]);
      var y_scale = d3
        .scaleLinear()
        .domain([0, d3.max(y_data)])
        .range([h, 0]);
  
      container
        .selectAll(".y_axis_g")
        .data([0])
        .join("g")
        .attr("class", "y_axis_g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_scale));
  
      var u = container.selectAll("rect")
        .data(temp_data)  

      u
        .enter()
        .append("rect")
        .merge(u)
        .attr("x", function (d) {
          return x_scale(d[0]);
        })
        .attr("y", function (d) {
          return y_scale(d[1]);
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", function (d) {
          return h - y_scale(d[1]);
        })
        .attr("fill", "gray");
      
      u
        .exit()
        .remove()

    }
    render() {
      return (
        <svg className="child1_svg">
          <g className="g_1"></g>
        </svg>
      );
    }
  }

  export default Child1;