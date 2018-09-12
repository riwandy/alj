import React, { Component } from 'react';
import './css/User.css';

// import components
import List from './List'
import UserDisplay from './UserDisplay'

class User extends Component{
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
                    <List updateSelectEmployee={this.selectEmployee.bind(this)} name="user" />
                    <UserDisplay />
                </div>
        )
    }
}

export default User;