import React, { Component } from 'react';
import * as d3 from 'd3';

class Child2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.data);
  }

  componentDidUpdate() {
    var temp_data = this.props.data

    const data = temp_data.map(({ total_bill, tip, size }) => ({ total_bill, tip, size }));

    console.log('Data for Child2')
    console.log(data);

    // Set the dimensions and margins of the graph
    /*
    var margin = {top: 10, right: 10, bottom: 30, left: 20},
      w = 500 - margin.left - margin.right,
      h = 300 - margin.top - margin.bottom;
    
    var container = d3.select('.child2_svg')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .select('.g_2')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    */

    // Coefficients of correlation
    function pearsonCorrelation(data1, data2) {
        const n = data1.length;
        const sumX = d3.sum(data1);
        const sumY = d3.sum(data2);
        const sumXY = data1.reduce((acc, val, i) => acc + (val * data2[i]), 0);
        const sumX2 = data1.reduce((acc, val) => acc + Math.pow(val, 2), 0);
        const sumY2 = data2.reduce((acc, val) => acc + Math.pow(val, 2), 0);
      
        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt(((n * sumX2) - Math.pow(sumX, 2)) * ((n * sumY2) - Math.pow(sumY, 2)));
      
        return numerator / denominator;
    }
      
    // Extract numerical columns from new_data
    const total_bill = data.map(d => d.total_bill);
    const tip = data.map(d => d.tip);
    const size = data.map(d => d.size); 
    // Calculate correlation coefficients
    const correlation_tb_tip = pearsonCorrelation(total_bill, tip);
    const correlation_tb_size = pearsonCorrelation(total_bill, size);
    const correlation_tip_size = pearsonCorrelation(tip, size);
    // Create list of correlations
    var corr_matrix = [
        [1, correlation_tb_tip, correlation_tb_size],
        [correlation_tb_tip, 1, correlation_tip_size],
        [correlation_tb_size, correlation_tip_size, 1]
    ]
    console.log(corr_matrix)

    // Set dimensions
    const cellSize = 100;
    const w = 3*cellSize;
    const h = w;
    const left_margin = 100
    const width = 600
    
    var container = d3.select('.child2_svg')
      .attr('width', width)
      .attr('height', h)
      .select(".g_2")
    
    var rows = container
        .selectAll('.row')
        .data(corr_matrix)
        .enter()
        .append('g')
        .attr('class', 'row')
        .attr('transform', (d,i) => `translate(0, ${i*cellSize})`)
    
    var colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0,1])    
    
    rows.selectAll('.rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('class', 'rect')
        .attr('x', (d,i) => left_margin+i*cellSize)
        .attr('y', 0)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', d => colorScale(d))
        .attr('stroke', 'white')

    rows.selectAll('.label')
        .data(d => d)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d,i) => left_margin + i * cellSize + 0.5*cellSize)
        .attr('y', 0.5*cellSize)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.toFixed(2))

    var legend = container
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d,i) => `translate(${w+125}, ${0})`)
    legend
        .selectAll('legend-rect')
        .data(d3.range(0,1,1/10))
        .enter()
        .append('rect')
        .attr('class', 'legend-rect')
        .attr('x', 0)
        .attr('y', (d,i) => i*20)
        .attr('width', 25)
        .attr('height', h/10+80)
        .style('fill', d => colorScale(d))
    
    container
        .append("text")
        .attr("x", w+160)
        .attr("y", 20)
        .text("0");
    container
        .append("text")
        .attr("x", w+160)
        .attr("y", h-10)
        .text("1");
  }

  render() {
    return (
      <svg className='child2_svg'>
          <g className='g_2'></g>
      </svg>
    );
  }
}

export default Child2;