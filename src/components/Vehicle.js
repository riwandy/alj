import React, { Component } from 'react';

// import components
import List from './List'
import VehicleDisplay from './VehicleDisplay'

class Vehicle extends Component{
    constructor() {
        super();
        this.state = {
            selectedVehicle : ''
        }
    }
    render() {
        return (
                <div className="content">
                    <List name="vehicle" />
                    <VehicleDisplay />
                </div>
        )
    }
}

export default Vehicle;