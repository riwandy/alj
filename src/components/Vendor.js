import React, { Component } from 'react';

// import components
import List from './List'
import VendorDisplay from './VendorDisplay'

class Vendor extends Component{
    constructor() {
        super();
        this.state = {
            selectedVendor : ''
        }
    }
    render() {
        return (
                <div className="content">
                    <List name="vendor" />
                    <VendorDisplay />
                </div>
        )
    }
}

export default Vendor;