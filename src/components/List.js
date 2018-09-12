import React, { Component } from 'react';
import './css/List.css';

import ListItem from './ListItem';
import { connect } from 'react-redux';
import EmployeeService from '../services/EmployeeService'
import AuthenticationService from '../services/AuthenticationService'
import ProjectService from '../services/ProjectService';
import VendorService from '../services/VendorService';
import ClientService from '../services/ClientService';
import AssetService from '../services/AssetService';
import VehicleService from '../services/VehicleService';

class List extends Component{
    constructor() {
        super();
        this.state = {
            search : '',
            list : []
        }
    }

    //search
    onSearch(newSearch) {
        this.setState({search : newSearch})
    }
    onUpdate(e){
        let search = e.target.value;
        this.onSearch(search)
    }
    handleRegisterClick = () => {
        switch (this.props.name) {
            case 'employee' : {
                this.props.cleanSelectedEmployee()
                break
            }
            case 'user' : {
                this.props.cleanSelectedUser()
                break
            }
            case 'project' : {
                this.props.cleanSelectedProject()
                break
            }
            case 'vendor' : {
                this.props.cleanSelectedVendor()
                break
            }
            case 'client' : {
                this.props.cleanSelectedClient()
                break
            }
        }
    }

    //fetch employeelist befor render
    async componentWillMount() {
        console.log(this.props.name)
        switch (this.props.name) {
            case 'employee' : {
                let lists = await EmployeeService.getEmployees();
                this.setState({list : lists.data.slice()})
                this.props.fetchEmployeeList()
                break
            }
            case 'user' : {
                let lists = await AuthenticationService.getUsers();
                await this.setState({list : lists.data.slice()})
                console.log(this.state.list)
                await this.props.fetchUserList()
                break
            }
            case 'project' : {
                let lists = await ProjectService.getProjects();
                await this.setState({list : lists.data.slice()})
                console.log(this.state.list)
                await this.props.fetchProjectList()
                break
            }
            case 'vendor' : {
                let lists = await VendorService.getVendors();
                await this.setState({list : lists.data.slice()})
                console.log(this.state.list)
                await this.props.fetchVendorList()
                break
            }
            case 'client' : {
                let lists = await ClientService.getClients();
                await this.setState({list : lists.data.slice()})
                console.log(this.state.list)
                await this.props.fetchClientList()
                break
            }
            case 'vehicle' : {
                let lists = await VehicleService.getVehicles();
                await this.setState({list : lists.data.slice()})
                console.log(this.state.list)
                await this.props.fetchVehicleList()
                break
            }
            case 'asset' : {
                let lists = await AssetService.getAssets();
                await this.setState({list : lists.data.slice()})
                console.log(this.state.list)
                await this.props.fetchAssetList()
                break
            }
        }
    }

    render() {
        var listItems = []
        switch (this.props.name) {
            case 'user' : {
                var filterUser = (this.props.userList).filter((user)=>{
                    console.log(user)
                    return (user.Employee.name.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                    (user.username.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                    (user.employeeID.toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                listItems = filterUser.map(function(user){
                    return <ListItem detail={user} key={user.employeeID} name="user"/>
                })
                break
            }
            case 'employee' : {
                var filterEmployee = (this.props.employeeList).filter((employee)=>{
                    return (employee.name.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (employee.address.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (employee.idNumber.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (employee.employeeID.toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                listItems = filterEmployee.map(function(employee){
                    return <ListItem detail={employee} key={employee.employeeID} name="employee"/>
                })
                break   
            }
            case 'project' : {
                var filterProject = (this.props.projectList).filter((project)=>{
                    return (project.Client.name.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (project.Employee.name.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (project.category.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (project.projectID.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (project.contract.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (project.location.toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                console.log(filterProject)
                listItems = filterProject.map(function(project){
                    return <ListItem detail={project} key={project.projectID} name="project"/>
                })
                break   
            }
            case 'vendor' : {
                var filterVendor = (this.props.vendorList).filter((vendor)=>{
                    return (vendor.name.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (vendor.business.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (vendor.vendorID.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                listItems = filterVendor.map(function(vendor){
                    return <ListItem detail={vendor} key={vendor.vendorID} name="vendor"/>
                })
                break   
            }
            case 'client' : {
                var filterClient = (this.props.clientList).filter((client)=>{
                    return (client.name.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                        //    (client.business.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (client.clientID.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                listItems = filterClient.map(function(client){
                    return <ListItem detail={client} key={client.clientID} name="client"/>
                })
                break   
            }
            case 'asset' : {
                var filterAsset = (this.props.assetList).filter((asset)=>{
                    return (asset.category.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (asset.clientID.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                listItems = filterAsset.map(function(asset){
                    return <ListItem detail={asset} key={asset.assetID} name="asset"/>
                })
                break   
            }
            case 'vehicle' : {
                var filterVehicle = (this.props.vehicleList).filter((vehicle)=>{
                    return (vehicle.type.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                        //    (client.business.toUpperCase()).match((this.state.search.toString()).toUpperCase()) ||
                           (vehicle.vehicleID.toString().toUpperCase()).match((this.state.search.toString()).toUpperCase())
                })
                listItems = filterVehicle.map(function(vehicle){
                    return <ListItem detail={vehicle} key={vehicle.vehicleID} name="vehicle"/>
                })
                break   
            }
        }

        return (
                <div className="list">
                    <div className="search-bar">
                        <input type="text" value={this.state.search} onChange={this.onUpdate.bind(this)} placeholder="SEARCH"/>
                        <button onClick={this.handleRegisterClick}><span>REGISTER</span></button>
                    </div>
                    <div className="wrapper">
                        {listItems}
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        employeeList : state.employeeReducer.employeeList.slice(),
        userList : state.userReducer.userList.slice(),
        projectList : state.projectReducer.projectList.slice(),
        vendorList : state.vendorReducer.vendorList.slice(),
        clientList : state.clientReducer.clientList.slice(),
        vehicleList : state.vehicleReducer.vehicleList.slice(),
        assetList : state.assetReducer.assetList.slice()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        cleanSelectedEmployee : () => {
            dispatch({type : 'CLEAN_SELECTED_EMPLOYEE', payload : {} });
        },
        cleanSelectedUser : () => {
            dispatch({type : 'CLEAN_SELECTED_USER', payload : {} });
        },
        cleanSelectedProject : async () => {
            dispatch({type : "CLEAN_SELECTED_PROJECT", payload : {}})
        },
        cleanSelectedVendor : async () => {
            dispatch({type : "CLEAN_SELECTED_VENDOR", payload : {}})
        },
        cleanSelectedClient : async () => {
            dispatch({type : "CLEAN_SELECTED_CLIENT", payload : {}})
        },
        cleanSelectedVehicle : async () => {
            dispatch({type : "CLEAN_SELECTED_VEHICLE", payload : {}})
        },
        cleanSelectedAsset : async () => {
            dispatch({type : "CLEAN_SELECTED_ASSET", payload : {}})
        },
        fetchEmployeeList : async () => {
            let fetchedList = await EmployeeService.getEmployees();
            dispatch({type : 'FETCH_EMPLOYEE_LIST', payload : fetchedList.data});
        },
        fetchUserList : async () => {
            let fetchedList = await AuthenticationService.getUsers();
            dispatch({type : 'FETCH_USER_LIST', payload : fetchedList.data});
        },
        fetchProjectList : async () => {
            let fetchedList = await ProjectService.getProjects();
            dispatch({type : 'FETCH_PROJECT_LIST', payload : fetchedList.data});
        },
        fetchVendorList : async () => {
            let fetchedList = await VendorService.getVendors();
            dispatch({type : 'FETCH_VENDOR_LIST', payload : fetchedList.data});
        },
        fetchClientList : async () => {
            let fetchedList = await ClientService.getClients();
            dispatch({type : 'FETCH_CLIENT_LIST', payload : fetchedList.data});
        },
        fetchVehicleList : async () => {
            let fetchedList = await VehicleService.getVehicles();
            dispatch({type : 'FETCH_VEHICLE_LIST', payload : fetchedList.data});
        },  
        fetchAssetList : async () => {
            let fetchedList = await AssetService.getAssets();
            dispatch({type : 'FETCH_ASSET_LIST', payload : fetchedList.data});
        }   
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);