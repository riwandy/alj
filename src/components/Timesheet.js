import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import equal from 'deep-equal';
import './css/Timesheet.css'
import { Button,Input,Icon } from 'semantic-ui-react';
import TimesheetDisplay from './TimesheetDisplay'
import EmployeeService from '../services/EmployeeService'

class Timesheet extends Component{
    constructor(props){
        super(props);
        this.state = {
            employeeList : [],
            projectList : [],
            selectedEmployee : '',
            displayState : 'employee' //employee, project-detailed, employee-detailed
        }
    }

    handleEmployeeChange = (e, {value}) => {
        this.setState({selectedEmployee : value})
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.employeeList,state.prevEmployeeList)){
            return {
                employeeList : [].concat(props.employeeList),
            }
        }else{
            return null
        }
    }
    
    render(){
        return (
            <div className="timesheet">
                <div className="timesheet-control">
                    <Button.Group className="button">
                        <Button onClick={()=>{this.props.updateDisplayState('employee')}}>KARYAWAN</Button>
                        <Button onClick={()=>{this.props.updateDisplayState('project')}}>PROYEK</Button>
                    </Button.Group>
                    <Input icon placeholder='Search...' className="search">
                        <input value={this.props.search} onChange={(e)=>{this.props.updateSearch(e.target.value)}} />
                        <Icon name='search' />
                    </Input>                    
                </div>
                <TimesheetDisplay className="TimesheetDisplay"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        search : (state.timesheetReducer.search)
        
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayState : (newState) => {
            dispatch({type : 'UPDATE_DISPLAY_STATE', payload : newState})
        },
        updateSearch : (newSearch) => {
            dispatch({type : 'UPDATE_SEARCH', payload : newSearch})
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Timesheet);