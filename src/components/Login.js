import React, { Component } from 'react';
import './css/Login.css';
import { connect } from 'react-redux';
import { Input, Button } from 'semantic-ui-react'
import AuthenticationService from '../services/AuthenticationService';

class Login extends Component{
    constructor(props){
        super(props),
        this.state = {
            username : '',
            password : '',
            error : ''
        }
    }

    handleChange = (e,{name, value}) => {
        let newData = {}
        newData[name] = value
        this.setState(Object.assign(this.state,newData))
    }

    handleCancel = () => {
        this.setState({username:'',password:'',error:''})
    }

    handleLogin = async () => {
        let feedback = await this.props.login({
            username : this.state.username,
            password : this.state.password
        })
        if(feedback.status == 200)
            this.props.history.push("/dashboard/karyawan");
        else
            this.setState({error : feedback.data.error})
    }

    render() {
        if(this.props.isAuthenticated){
            this.props.history.push("/dashboard/karyawan");
        }
        return (
            <div className="login-wrapper">
                <div className="login">
                    <img src='assets/logo.png' className='logo'/>
                    <div className='form-control'>
                        <Input name="username" placeholder="username" value={this.state.username} onChange={this.handleChange}/>
                    </div>
                    <div className='form-control'>
                        <Input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange}/>
                    </div>
                    <p className="error">{this.state.error}</p>
                    <div className="controls">
                        <Button primary onClick={this.handleLogin}>Login</Button>
                        <Button negative onClick={this.handleCancel}>Cancel</Button>
                        <Button  onClick={this.handleCancel}>Signup</Button>
                    </div>
                </div>
            </div>
        )
    }
}
 
const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.authenticationReducer.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login : async (credentials) => {
            let token = await AuthenticationService.login(credentials)
            if(token.status == 200){
                await dispatch({type : 'UPDATE_CURRENT_USER', payload : token.data.user})
                await dispatch({type : 'SET_AUTHENTICATED'})
            }
            return token
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);