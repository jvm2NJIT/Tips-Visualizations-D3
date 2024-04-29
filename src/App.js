import React, { Component } from 'react';
import './App.css'
import Child1 from './Child1';
import Child2 from './Child2';
import Child3 from './Child3';
import * as d3 from 'd3'
import tips from './tips.csv'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_data:[],
      selected_numerical: 'total_bill',
      selected_categorical: 'day'
    };
  }

  componentDidMount() {
    var self=this
    d3.csv(tips, function(d) {
      return {
        tip:parseFloat(d.tip),
        total_bill:parseFloat(d.total_bill),
        size:parseInt(d.size),
        day:d.day,
        smoker:d.smoker,
        sex:d.sex,
        time:d.time
      }
    })
    .then(function(csv_data) {
      self.setState({all_data:csv_data})
      console.log(csv_data)
    })
    .catch(function(err) {
      console.log(err)
    })
    console.log(this.state.all_data)
  }

  render() {
    console.log('Render is called');
    return <div className='parent'>
      <div className='row1'>
        <p>Select target:</p>
        <select onChange={(event)=>this.setState({selected_numerical: event.target.value})}>
          <option>total_bill</option>
          <option>tip</option>
          <option>size</option>
        </select>
      </div>
      <div className='row2'>
        <div className='bar-chart'>
          <select onChange={(event)=>this.setState({selected_categorical: event.target.value})}>
            <option>day</option>
            <option>sex</option>
            <option>smoker</option>
            <option>time</option>
          </select>
          <Child1 data={this.state.all_data} numerical={this.state.selected_numerical} categorical={this.state.selected_categorical}>

          </Child1>
        </div>
        <div className='corr-matrix'>
          <Child2 data={this.state.all_data} numerical={this.state.selected_numerical} categorical={this.state.selected_categorical}>
            Hello
          </Child2>       
        </div>
      </div>
      <div className='row3'>
        <div className='scatter-plot'>
          <Child3 data={this.state.all_data} numerical={this.state.selected_numerical} categorical={this.state.selected_categorical}>

          </Child3>
        </div>
      </div>
    </div>;
  }
}

export default App;
