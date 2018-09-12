import React, { Component } from 'react';

// import components
import List from './List'
import AssetDisplay from './AssetDisplay'

class Asset extends Component{
    constructor() {
        super();
        this.state = {
            selectedAsset : ''
        }
    }
    render() {
        return (
                <div className="content">
                    <List name="asset" />
                    <AssetDisplay />
                </div>
        )
    }
}

export default Asset;