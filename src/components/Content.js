import React, { Component } from 'react';
import './css/Content.css';

// import components
import List from './List'
import Display from './Display'

class Content extends Component{
    constructor() {
        super();
        this.state = {
            selectedEmployee : ''
        }
    }
    selectEmployee() {

    }
    render() {
        return (
                <div className="content">
                <List updateSelectEmployee={this.selectEmployee.bind(this)} name="employee" />
                <Display />
                </div>
        )
    }
}

export default Content;