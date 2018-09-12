import React, { Component } from 'react';
import './css/ListItem.css';
import { connect } from 'react-redux';

class ListItem extends Component{
    constructor() {
        super();
        this.state = {
            isSelected : false
        }
    }

    handleClick() {
        switch (this.props.name) {
            case 'user' : {
                this.props.updateSelectedUser(this.props.detail);
                break
            }
            case 'employee' : {
                this.props.updateSelectedEmployee(this.props.detail);
                break
            }
            case 'project' : {
                this.props.updateSelectedProject(this.props.detail);
                break
            }
            case 'vendor' : {
                this.props.updateSelectedVendor(this.props.detail);
                break
            }
            case 'client' : {
                this.props.updateSelectedClient(this.props.detail);
                break
            }
            case 'asset' : {
                this.props.updateSelectedAsset(this.props.detail);
                break
            }
            case 'vehicle' : {
                this.props.updateSelectedVehicle(this.props.detail);
                break
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.selectedEmployee.employeeID === props.detail.employeeID){
            return {
                isSelected : true
            }
        }else {
            return null
        }
    }

    render() {
        switch (this.props.name) {
            case 'user' : {
                return (
                        <div className="list-item user" onClick={this.handleClick.bind(this)}>
                            <div className='ID'>{this.props.detail.employeeID}</div>
                            <div className="detail">
                                <div className='username'><b>{this.props.detail.username}</b></div>
                                <div className='name'>{this.props.detail.Employee.name}</div>
                            </div>
                        </div>
                )
            }
            case 'employee' : {
                return (
                        <div className={"list-item employee"} onClick={this.handleClick.bind(this)}>
                            <div className='ID'>{this.props.detail.employeeID}</div>
                            <div className='name'><b>{this.props.detail.name}</b></div>
                            <div className='address'>{this.props.detail.address}</div>
                            <div className='idNumber'><b>{this.props.detail.idNumber}</b></div>
                        </div>
                )
            }
            case 'project' : {
                return (
                    <div className={"list-item project"} onClick={this.handleClick.bind(this)}>
                        <div className='ID'>{this.props.detail.projectID}</div>
                        <div className="detail">
                            <div className='location'><b>{this.props.detail.location}</b></div>
                            <div className='category'>{this.props.detail.category}</div>
                            <div className='contract'><b>{this.props.detail.contract}</b></div>
                        </div>
                    </div>
                )
            }
            case 'vendor' : {
                return (
                    <div className={"list-item vendor"} onClick={this.handleClick.bind(this)}>
                        <div className='ID'>{this.props.detail.vendorID}</div>
                        <div className="detail">
                            <div className='name'><b>{this.props.detail.name}</b></div>
                            <div className='business'>{this.props.detail.business}</div>
                        </div>
                    </div>
                )
            }
            case 'client' : {
                let businessArray = this.props.detail.business.map((value)=>{
                    return (
                        <span className="business-array">{value}</span>
                    )
                })
                return (
                    <div className={"list-item client"} onClick={this.handleClick.bind(this)}>
                        <div className='ID'>{this.props.detail.clientID}</div>
                        <div className="detail">
                            <div className='name'><b>{this.props.detail.name}</b></div>
                            {businessArray}
                        </div>
                    </div>
                )
            }
            case 'vehicle' : {
                return (
                    <div className={"list-item vehicle"} onClick={this.handleClick.bind(this)}>
                        <div className='ID'>{this.props.detail.vehicleID}</div>
                        <div className="detail">
                            <div className='category'><b>{this.props.detail.category} - {this.props.detail.type}</b></div>
                            <div className='series'>{this.props.detail.series}</div>
                            <div className='year'><b>{this.props.detail.year}</b></div>
                        </div>
                    </div>
                )
            }
            case 'asset' : {
                return (
                    <div className={"list-item asset"} onClick={this.handleClick.bind(this)}>
                        <div className='ID'>{this.props.detail.assetID}</div>
                        <div className="detail">
                            <div className='name'><b>{this.props.detail.category}</b></div>
                        </div>
                    </div>
                )
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        selectedEmployee : state.employeeReducer.selectedEmployee
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateSelectedEmployee : (newID) => {
            console.log("this.props.detail.employeeID")
            dispatch({type : 'UPDATE_SELECTED_EMPLOYEE', payload : newID});
        },
        updateSelectedUser : (newID) => {
            dispatch({type : 'UPDATE_SELECTED_USER', payload : newID});
        },
        updateSelectedProject : (newID) => {
            dispatch({type : 'UPDATE_SELECTED_PROJECT', payload : newID});
        },
        updateSelectedVendor : (newID) => {
            dispatch({type : 'UPDATE_SELECTED_VENDOR', payload : newID});
        },
        updateSelectedClient : (newID) => {
            dispatch({type : 'UPDATE_SELECTED_CLIENT', payload : newID});
        },
        updateSelectedVehicle : (newID) => {
            dispatch({type : 'UPDATE_SELECTED_VEHICLE', payload : newID});
        },
        updateSelectedAsset : (newID) => {
            dispatch({type : 'UPDATE_SELECTED_ASSET', payload : newID});
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);