import React, { Component } from 'react';
import styles from './css/Display.css';
// eslint-disable-next-line
import { connect, connectAdvanced } from 'react-redux';
import EmployeeService from '../services/EmployeeService'
import swal from 'sweetalert';
import iziToast from 'izitoast';
import equal from 'deep-equal';

class Display extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            selectedEmployee : {
                id: "",
                employeeID: "",
                name: "",
                address: "",
                idNumber: "",
                hp: [],
                whatsapp: "",
                position: "",
                debt: "",
                salary: "",
                emergency_contact: "",
                emergency_phone: "",
                emergency_address: ""
            },
            prevSelectedEmployee : {},
            newEmployee : {
                id: "",
                employeeID: "",
                name: "",
                address: "",
                idNumber: "",
                hp: [],
                whatsapp: "",
                position: "",
                debt: "",
                salary: "",
                emergency_contact: "",
                emergency_phone: "",
                emergency_address: ""
            }
        }
    }

    //eventhandler function
    handleSelectedEmployeeChange = (e) => {
        let newState = Object.assign(this.state.selectedEmployee)
        newState[e.target.name] = e.target.value;
        this.setState({selectedEmployee : newState})
    }
    
    handleNewEmployeeChange(e) {
        let newState = Object.assign({},this.state.newEmployee)
        newState[e.target.name] = e.target.value;
        this.setState({newEmployee : newState})
    }

    handleEditModeClick = () => {
        this.setState({editMode : true})
        console.log('fired')
    }

    handleEditEmployeeSubmit = async () => {
        try{
            let employeeID = this.state.selectedEmployee
            await EmployeeService.updateDetail(employeeID)
            await this.props.fetchEmployeeList()
            await this.props.editSelectedEmployee(employeeID)
            console.log(employeeID)
            await this.setState({prevSelectedEmployee : Object.assign({}, this.props.selectedEmployee)})
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Perubahan anda telah berhasil disimpan'
                });
        }catch(err){
            
        }
    }

    handleDeleteEmployeeClick = async () => {
        try{
            let confirmed = await swal(`Apakah anda yakin akan menghapus ${this.state.selectedEmployee.name} dari daftar karyawan ?`, 
                                        {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                    );
            if(confirmed){
                await EmployeeService.deleteEmployee(this.state.selectedEmployee.employeeID)
                await this.props.fetchEmployeeList()
                this.props.editSelectedEmployee()
                iziToast.success({
                        title: this.state.selectedEmployee.name,
                        position: 'bottomRight',
                        message: `telah berhasil dihapus dari daftar karyawan`
                    });
            }
        }catch(err){

        }
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.selectedEmployee,state.prevSelectedEmployee)){
            return {
                selectedEmployee : Object.assign({}, props.selectedEmployee),
                prevSelectedEmployee : Object.assign({}, props.selectedEmployee),
                newEmployee : {
                    id: "",
                    employeeID: "",
                    name: "",
                    address: "",
                    idNumber: "",
                    hp: [],
                    whatsapp: "",
                    position: "",
                    debt: "",
                    salary: "",
                    emergency_contact: "",
                    emergency_phone: "",
                    emergency_address: ""
                },
                editMode : false
            }
        }else{
            return null
        }
    }

    render() {
        console.log(this.state.selectedEmployee)

        if(this.props.selectedEmployee.employeeID === ""){
            return (
                <div className="display">
                    <div className="form-group"  id="name" >
                        <label>Nama</label>
                        <input name="name" 
                               value={this.state.newEmployee.name}
                               onChange={this.handleNewEmployeeChange.bind(this)} 
                        />
                    </div>
                    <div className="form-group" id="idNumber" >
                        <label>NIK</label>
                        <input name="idNumber"
                               value={this.state.newEmployee.idNumber}
                               onChange={this.handleNewEmployeeChange.bind(this)} 
                        />
                    </div>
                </div>
            )
        } else{
            console.log(this.state.selectedEmployee.hp)
            if(this.state.selectedEmployee.hp !== undefined){
                var phoneList = this.state.selectedEmployee.hp
                var phone = phoneList.map((data,index)=>{
                    return 
                    <div id={"hp" + index} className="form-control">
                        <label className="label">{"HP "+index}</label>
                        <input name="whatsapp" placeholder="Whatsapp"
                                readOnly={!this.state.editMode}
                                className="input"
                                value={data}
                                onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                    </div>
                })
            }
        
            return (
                <div className="display">
                    <a id="employeeID">{this.state.selectedEmployee.employeeID}</a>
                    <div id="personal">
                        <span id="title"><i className="material-icons">person</i>Data Pribadi</span>
                        <div id="name" className="form-control-1">
                            <label for="name">Nama</label>
                            <input name="name"
                                    readOnly={!this.state.editMode} type="text"
                                    className="validate" 
                                    value={this.state.selectedEmployee.name}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="address" className="form-control-1">
                            <label className="label">Alamat</label>
                            <textarea name="address" placeholder="Alamat" rows="4"
                                    readOnly={!this.state.editMode}
                                    label= "Name" className="input"
                                    value={this.state.selectedEmployee.address}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="photo"></div>
                        <div id="idNumber" className="form-control-1">
                            <label className="label">NIK</label>
                            <input name="idNumber" placeholder="NIK"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.idNumber}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                    </div>
                    <div id="contact">
                        <div id="whatsapp" className="form-control">
                            <label className="label">Whatsapp</label>
                            <input name="whatsapp" placeholder="Whatsapp"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.whatsapp}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="hp">
                            {phone}
                        </div>
                    </div>
                    <div id="personnel">
                        <div id="position" className="form-control-3">
                            <label className="label">Jabatan</label>
                            <select name="position" placeholder="Jabatan"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.position}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="salary" className="form-control-3">
                            <label className="label">Gaji</label>
                            <input name="salary" placeholder="Gaji"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.debt}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="debt" className="form-control-3">
                            <label className="label">Hutang</label>
                            <input name="debt" placeholder="Hutang"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.debt}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                    </div>
                    <div id="emergency">
                        <div id="emergency_contact" className="form-control">
                            <label className="label">Kontak darurat</label>
                            <input name="emergency_contact" placeholder="Kontak darurat"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.emergency_contact}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="emergency_phone" className="form-control">
                            <label className="label">No. Telepon Darurat</label>
                            <input name="emergency_phone" placeholder="No. Telepon Darurat"
                                    readOnly={!this.state.editMode}
                                    className="input"
                                    value={this.state.selectedEmployee.emergency_phone}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                        <div id="emergency_address" className="form-control">
                            <label className="label">Alamat Darurat</label>
                            <textarea name="emergency_address" placeholder="Alamat Darurat"
                                    readOnly={!this.state.editMode}
                                    className="input" rows="4"
                                    value={this.state.selectedEmployee.emergency_address}
                                    onChange={this.handleSelectedEmployeeChange.bind(this)}/>
                        </div>
                    </div>
                    <div id="controls">
                        <button onClick={this.handleEditModeClick}
                                disabled={this.state.editMode}
                                className="button is-primary">
                            <i className="material-icons" >edit</i>
                            EDIT
                        </button>
                        <button onClick={this.handleEditEmployeeSubmit}
                                disabled={equal(this.props.selectedEmployee, this.state.selectedEmployee) ? true : false}
                                variant="contained" color="secondary">
                            <i style={{marginRight: 0.3 + 'em'}} >save</i>
                            SAVE
                        </button>
                        <button onClick={this.handleDeleteEmployeeClick}
                                variant="contained" color="secondary">
                            <i style={{marginRight: 0.3 + 'em'}} >delete</i>
                            DELETE
                        </button>
                    </div>
                </div>
            )

        }
    }
}

const mapStateToProps = (state) => {
    return {
        selectedEmployee : Object.assign({},state.employeeReducer.selectedEmployee)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSelectedEmployee : async (employeeID) => {
            let fetchedData = await EmployeeService.getEmployee(employeeID)
            if(fetchedData.status === 200){
                await dispatch({type : "UPDATE_SELECTED_EMPLOYEE", payload : fetchedData.data})
            }
        },
        fetchEmployeeList : async () => {
            let fetchedList = await EmployeeService.getEmployees();
            console.log(fetchedList)
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_EMPLOYEE_LIST', payload : fetchedList.data});
            }
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Display);