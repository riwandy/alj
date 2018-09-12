import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './css/Dashboard.css';

//import components
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Content from './Content'
import Timesheet from './Timesheet'
import User from './User'
import Project from './Project'
import Vendor from './Vendor';
import Client from './Client';
import Asset from './Asset';
import Vehicle from './Vehicle';

import { connect } from 'react-redux';

//import services
import EmployeeService from '../services/EmployeeService';
import ProjectService from '../services/ProjectService';
import ClientService from '../services/ClientService';
import VendorService from '../services/VendorService';
import VehicleService from '../services/VehicleService';
import AssetService from '../services/AssetService';

class Dashboard extends Component{
    constructor(props){
        super(props),
        this.state = {

        }
    }
    render() {
        this.props.fetchEmployeeList()
        this.props.fetchProjectList()
        this.props.fetchClientList()
        this.props.fetchAssetList()
        this.props.fetchVehicleList()
        this.props.fetchVendorList()
        if(!this.props.isAuthenticated){
            this.props.history.push("/login");
        }
        return (
            <div className="dashboard">
                <Navbar />
                <Sidebar />
                <Route path='/dashboard/karyawan' component={Content} replace />
                <Route path='/dashboard/timesheet' component={Timesheet} replace={true} />
                <Route path='/dashboard/user' component={User} replace={true} />
                <Route path='/dashboard/project' component={Project} replace={true} />
                <Route path='/dashboard/vendor' component={Vendor} replace={true} />
                <Route path='/dashboard/client' component={Client} replace={true} />
                <Route path='/dashboard/asset' component={Asset} replace={true} />
                <Route path='/dashboard/vehicle' component={Vehicle} replace={true} />
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
        fetchEmployeeList : async () => {
            let fetchedList = await EmployeeService.getEmployees();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_EMPLOYEE_LIST', payload : fetchedList.data});
            }
        } ,
        fetchProjectList : async () => {
            let fetchedList = await ProjectService.getProjects()
            if(fetchedList.status === 200){
                dispatch({type : 'FETCH_PROJECT_LIST', payload : fetchedList.data})
            }
        } ,
        fetchVendorList : async () => {
            let fetchedList = await VendorService.getVendors()
            console.log(fetchedList)
            if(fetchedList.status === 200){
                dispatch({type : 'FETCH_VENDOR_LIST', payload : fetchedList.data})
            }
        },
        fetchClientList : async () => {
            let fetchedList = await ClientService.getClients()
            console.log(fetchedList)
            if(fetchedList.status === 200){
                dispatch({type : 'FETCH_CLIENT_LIST', payload : fetchedList.data})
            }
        },
        fetchVehicleList : async () => {
            let fetchedList = await VehicleService.getVehicles()
            console.log(fetchedList)
            if(fetchedList.status === 200){
                dispatch({type : 'FETCH_VEHICLE_LIST', payload : fetchedList.data})
            }
        },
        fetchAssetList : async () => {
            let fetchedList = await AssetService.getAssets()
            console.log(fetchedList)
            if(fetchedList.status === 200){
                dispatch({type : 'FETCH_ASSET_LIST', payload : fetchedList.data})
            }
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);