import React, { Component } from 'react';
import './css/User.css';

// import components
import List from './List'
import ProjectDisplay from './ProjectDisplay'

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
                    <List name="project" />
                    <ProjectDisplay />
                </div>
        )
    }
}

export default User;