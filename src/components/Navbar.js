import React, { Component } from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router'
import { Button } from 'semantic-ui-react'
import styles from './css/Navbar.css';
import equal from'deep-equal'

class Navbar extends Component{
    constructor(props){
        super(props)
        this.state = {
            currentUser : {}
        }
    }
    handleLogout = async () => {
        await this.props.logout()
        await localStorage.setItem('Authorization','')
        await this.props.history.push("/login");
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.currentUser,state.currentUser)){
            return {
                currentUser : [].concat(props.currentUser),
            }
        }else{
            return null
        }
    }
    render() {
        return (
                <div className="navbar">
                    <Button inverted color="red" onClick={this.handleLogout}>Logout</Button>
                    <div className="user-control">
                        <i className="material-icons">person</i>
                        <p>{this.props.currentUser.Employee.name}</p>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser : state.authenticationReducer.currentUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout : () => {
            dispatch({type : 'USER_LOGOUT'})
        }
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));