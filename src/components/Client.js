import React, { Component } from 'react';

// import components
import List from './List'
import ClientDisplay from './ClientDisplay'

class Client extends Component{
    constructor() {
        super();
        this.state = {
            selectedClient : ''
        }
    }
    render() {
        return (
                <div className="content">
                    <List name="client" />
                    <ClientDisplay />
                </div>
        )
    }
}

export default Client;