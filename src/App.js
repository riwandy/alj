import React, { Component } from 'react';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Display from './components/Display'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path={'/login'} component={Login} replace></Route>
            <Route path={'/dashboard'} component={Dashboard}></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
