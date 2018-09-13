import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import ClientService from '../services/ClientService'
import { Input,Header,Button,Select,TextArea,Label,Form,Segment } from 'semantic-ui-react'
import { DateInput,TimeInput,DateTimeInput,DatesRangeInput } from 'semantic-ui-calendar-react';
import swal from 'sweetalert';
import iziToast from 'izitoast';
import equal from 'deep-equal';
import styles from './css/VendorDisplay.css';
import VehicleService from '../services/VehicleService';

class VehicleDisplay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            selectedVehicle : {},
            prevSelectedVehicle : {},
            newVehicle : {
                vehicleID: "",
                category: "",
                type: "",
                brand: "",
                series: "",
                registration: "",
                year: "",
                location: "",
                condition: "",
                remark: "",
                gasoline: ""
            }
        }
    }

    //eventhandler function
    handleSelectedVehicleChange (e,{name,value}) {
        let newState = Object.assign({},this.state.selectedVehicle)
        newState[name] = value;
        this.setState({selectedVendor : newState})
    }
    
    handleNewVehicleChange(e,{value,name}) {
        let newState = Object.assign({},this.state.newVehicle)
        newState[name] = value;
        this.setState({newVehicle : newState})
    }

    handleAddVehicle = async (newID) => {
        let result = await VehicleService.addVehicle({...this.state.newVehicle, vehicleID : newID})
        if(result.status == 200){
            await this.props.fetchVendorList()
            await this.setState({newVehicle : 
                {
                    vehicleID: "",
                    category: "",
                    type: "",
                    brand: "",
                    series: "",
                    registration: "",
                    year: "",
                    location: "",
                    condition: "",
                    remark: "",
                    gasoline: ""
                }
            })
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Kendaraan baru telah berhasil didaftarkan'
                });
        }else{
            for(let i=0; i<result.data.error.length; i++){
                iziToast.error({
                        title: 'Gagal',
                        position: 'bottomRight',
                        message: result.data.error[i]
                    });
            }
        }
    }

    handleClearNewVehicle = () => {
        this.setState({newVehicle:
            {
                vehicleID: "",
                category: "",
                type: "",
                brand: "",
                series: "",
                registration: "",
                year: "",
                location: "",
                condition: "",
                remark: "",
                gasoline: ""
            }
        })    
    }

    handleEditModeClick = () => {
        this.setState({editMode : true})
    }

    handleEditVehicleSubmit = async () => {
        let result = await VehicleService.editVehicle(this.state.selectedVehicle)
        if(result.status == 200){
            await this.props.fetchVehicleList()
            await this.props.editSelectedVehicle(this.state.selectedVehicle.vehicleID)
            await this.setState({editMode : false})
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Perubahan anda telah berhasil disimpan'
                });
        }else {
            for(let i=0; i<result.data.error.length; i++){
                iziToast.error({
                        title: 'Gagal',
                        position: 'bottomRight',
                        message: result.data.error[i]
                    });
            }
        }
    }

    handleDeleteVehicleClick = async () => {
        let confirmed = await swal(`Apakah anda yakin akan menghapus ${this.state.selectedVehicle.vehicleID} dari daftar kendaraan ?`, 
                                    {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                );
        if(confirmed){
            let result = await VehicleService.deleteVehicle({vehicleID : this.state.selectedVehicle.vehicleID})
            if(result.status == 200){
                await iziToast.success({
                    title: this.state.selectedVehicle.vehicleID,
                    position: 'bottomRight',
                    message: `telah berhasil dihapus dari daftar proyek`
                });
                await this.props.fetchVehicleList()
                await this.props.clearSelectedVehicle()
            }else{
                await iziToast.error({
                    title: this.state.selectedVendor.vendorID,
                    position: 'bottomRight',
                    message: `gagal dihapus dari daftar proyek`
                });
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.selectedVendor,state.prevSelectedVendor)){
            return {
                selectedVehicle : Object.assign({}, props.selectedVehicle),
                prevSelectedVehicle : Object.assign({}, props.selectedVehicle),
                newVehicle : {
                    vehicleID: "",
                    category: "",
                    type: "",
                    brand: "",
                    series: "",
                    registration: "",
                    year: "",
                    location: "",
                    condition: "",
                    remark: "",
                    gasoline: ""
                },
                editMode : false
            }
        }else{
            return null
        }
    }

    render() {
        //get new vendorID
        let latestID = 0
        let vehicleList = this.props.vehicleList
        for(let i=0; i<vehicleList.length; i++){
            let ID = parseInt((vehicleList[i].vehicleID).slice(-5))
            if(ID>latestID){
                latestID = ID
            }
        }
        let newID = 'VHC'+((latestID+1).toString()).padStart(5,'0')

        //render vandor categories
        let categoryList = ['SPAREPART', 'BBM', 'SEMEN']
        let businesses = []
        for(let i=0; i<categoryList.length; i++){
            businesses = [...businesses, {key:categoryList[i], value:categoryList[i], text:categoryList[i]}]
        }
        
        if(equal(this.props.selectedVehicle,{})){
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="newVehicle">
                        <div className="title">
                                <i className="material-icons">people</i>
                                <span>Tambah Kendaraan / Alat</span>
                                <span className="titleID"><b>{newID}</b></span>
                            </div>
                            <div id="name" className="form-control-1">
                                <label htmlFor="name">Nama</label>
                                <Input name="name" placeholder='Nama'
                                        value={this.state.newVendor.name} onChange={this.handleNewVendorChange.bind(this)}/>
                            </div>
                            <div id="address" className="form-control-1">
                                <label htmlFor="address">Alamat</label>
                                <Form>
                                    <TextArea name="address" placeholder='Alamat'
                                            value={this.state.newVendor.address} onChange={this.handleNewVendorChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="npwp" className="form-control-1">
                                <label htmlFor="npwp">NPWP</label>
                                <Input name="npwp" placeholder='NPWP'
                                        value={this.state.newVendor.npwp} onChange={this.handleNewVendorChange.bind(this)}/>
                            </div>
                            <div id="business" className="form-control-1">
                                <label htmlFor="business">Kategori</label>
                                <Select name="business" placeholder='Kategori' options={businesses} search
                                        value={this.state.newVendor.business} onChange={this.handleNewVendorChange.bind(this)}/>
                            </div>
                            <div id="email" className="form-control-1">
                                <label htmlFor="email">Email</label>
                                <Input name="email" placeholder='Email'
                                        value={this.state.newVendor.email} onChange={this.handleNewVendorChange.bind(this)}/>
                            </div>
                            <Segment className="contactPerson">
                            <h4>Contact Person</h4>
                                <div id="cpName" className="form-control-1">
                                    <label htmlFor="email">Nama</label>
                                    <Input name="Name" placeholder='Nama'
                                            value={this.state.newVendor.contact_person.Name} onChange={this.handleNewVendorCPChange.bind(this)}/>
                                </div>
                                <div id="cpHP" className="form-control-1">
                                    <label htmlFor="HP">HP</label>
                                    <Input name="HP" placeholder='Email'
                                            value={this.state.newVendor.contact_person.HP} onChange={this.handleNewVendorCPChange.bind(this)}/>
                                </div>
                                <div id="cpWhatsapp" className="form-control-1">
                                    <label htmlFor="Whatsapp">Whatsapp</label>
                                    <Input name="Whatsapp" placeholder='Whatsapp'
                                            value={this.state.newVendor.contact_person.Whatsapp} onChange={this.handleNewVendorCPChange.bind(this)}/>
                                </div>
                                <div id="cpEmail" className="form-control-1">
                                    <label htmlFor="Email">Email</label>
                                    <Input name="Email" placeholder='Email'
                                            value={this.state.newVendor.contact_person.Email} onChange={this.handleNewVendorCPChange.bind(this)}/>
                                </div>
                            </Segment>

                            <div className="new-controls">
                                <Button icon="add" onClick={()=>this.handleAddVendor(newID)} color="green"/>
                                <Button icon="cancel" onClick={this.handleClearNewVendor} color="red"/>
                            </div>
                        </Segment>
                    </div>
                </div>
            )
        } else{
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="vendorDetail">
                            <div className="title">
                                <i className="material-icons">people</i>
                                <span>Informasi Kendaraan / Alat</span>
                                <span className="titleID"><b>{this.state.selectedVendor.vendorID}</b></span>
                            </div>
                            <div id="name" className="form-control-1">
                                <label htmlFor="name">Nama</label>
                                <Input name="name" placeholder='Nama' readOnly={!this.state.editMode}
                                        value={this.state.selectedVendor.name} onChange={this.handleSelectedVendorChange.bind(this)}/>
                            </div>
                            <div id="address" className="form-control-1">
                                <label htmlFor="address">Alamat</label>
                                <Form>
                                    <TextArea name="address" placeholder='Alamat' readOnly={!this.state.editMode}
                                            value={this.state.selectedVendor.address} onChange={this.handleSelectedVendorChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="npwp" className="form-control-1">
                                <label htmlFor="npwp">NPWP</label>
                                <Input name="npwp" placeholder='NPWP' readOnly={!this.state.editMode}
                                        value={this.state.selectedVendor.npwp} onChange={this.handleSelectedVendorChange.bind(this)}/>
                            </div>
                            <div id="business" className="form-control-1">
                                <label htmlFor="business">Kategori</label>
                                <Select name="business" placeholder='Kategori' options={businesses} search disabled={!this.state.editMode}
                                        value={this.state.selectedVendor.business} onChange={this.handleSelectedVendorChange.bind(this)}/>
                            </div>
                            <div id="email" className="form-control-1">
                                <label htmlFor="email">Email</label>
                                <Input name="email" placeholder='Email' readOnly={!this.state.editMode}
                                        value={this.state.selectedVendor.email} onChange={this.handleSelectedVendorChange.bind(this)}/>
                            </div>
                        </Segment>
                        <Segment id="vendorCPDetail">
                            <div className="title">
                                <i className="material-icons">people</i>
                                <span>Contact Person</span>
                            </div>
                            {/* {contact_person_render} */}
                        </Segment>
                    </div>
                    <div id="controls">
                            <Button circular onClick={this.handleEditModeClick}
                                    disabled={this.state.editMode} icon='edit'
                                    className="button is-primary" color='green' />
                            <Button circular onClick={this.handleEditVendorSubmit} icon='save'
                                    disabled={(
                                        equal(this.props.selectedVendor, this.state.selectedVendor) && 
                                        equal(this.props.selectedVendor.contact_person, this.state.selectedVendor.contact_person)
                                    ) ? true : false}
                                    color="blue" /> 
                            <Button circular onClick={this.handleDeleteVendorClick} icon='delete' color='red' />
                    </div>
                </div>
            )

        }
    }
}

const mapStateToProps = (state) => {
    return {
        selectedVehicle : Object.assign({},state.vehicleReducer.selectedVehicle),
        vehicleList : [...state.vehicleReducer.vehicleList],
        currentUser : Object.assign({},state.authenticationReducer.currentUser),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSelectedVehicle : async (vID) => {
            let fetchedData = await VehicleService.getVehicle({vehicleID : vID})
            if(fetchedData.status === 200){
                await dispatch({type : "UPDATE_SELECTED_VEHICLE", payload : fetchedData.data})
            }
        },
        clearSelectedVehicle : async () => {
            await dispatch({type : "UPDATE_SELECTED_VEHICLE", payload : {}})
        },
        fetchVehicleList : async () => {
            let fetchedList = await VehicleService.getVehicles();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_VEHICLE_LIST', payload : fetchedList.data});
            }
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(VehicleDisplay);