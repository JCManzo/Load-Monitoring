import React, { Component } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>My Dashboard</h2>
        </header>
        <Dashboard />
      </div>
    );
  }
}
