import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/SidebarItem.css';

class SidebarItem extends Component{
    render(props) {
        return (
            <Link to={this.props.link} replace>
                <div className="sidebar-item">
                    <i className="material-icons">face</i>
                    {this.props.menu}
                </div>
            </Link>
        )
    }
}

export default SidebarItem;