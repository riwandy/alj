import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import ClientService from '../services/ClientService'
import { Input,Header,Button,Select,TextArea,Label,Form,Segment } from 'semantic-ui-react'
import { DateInput,TimeInput,DateTimeInput,DatesRangeInput } from 'semantic-ui-calendar-react';
import swal from 'sweetalert';
import iziToast from 'izitoast';
import equal from 'deep-equal';
import styles from './css/VendorDisplay.css';
import VendorService from '../services/VendorService';

class AssetDisplay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            selectedVendor : {},
            prevSelectedVendor : {},
            newVendor : {
                vendorID: "",
                name: "",
                address: "",
                npwp: "",
                contact_person: {
                    Name : "",
                    Email : "",
                    Whatsapp :"",
                    HP : ""
                },
                email: ""
            }
        }
    }

    //eventhandler function
    handleSelectedVendorChange (e,{name,value,subclass}) {
        let newState = Object.assign({},this.state.selectedVendor)
        if(subclass == 'contactPerson'){
            let subState = Object.assign({},this.state.selectedVendor.contact_person)
            subState[name] = value;
            newState.contact_person = subState;
        }
        else{
            newState[name] = value;
        }
        this.setState({selectedVendor : newState})
    }
    
    handleNewVendorChange(e,{value,name}) {
        let newState = Object.assign({},this.state.newVendor)
        newState[name] = value;
        this.setState({newVendor : newState})
    }

    handleNewVendorCPChange(e,{value,name}) {
        let newState = Object.assign({},this.state.newVendor)
        newState.contact_person[name] = value;
        this.setState({newVendor : newState})
    }

    handleAddVendor = async (newID) => {
        let result = await VendorService.addVendor({...this.state.newVendor, vendorID : newID})
        if(result.status == 200){
            await this.props.fetchVendorList()
            await this.setState({newVendor : 
                {
                    vendorID: "",
                    name: "",
                    address: "",
                    npwp: "",
                    contact_person: {
                        Name : "",
                        Email : "",
                        Whatsapp :"",
                        HP : ""
                    },
                    email: ""
                }
            })
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Vendor baru telah berhasil didaftarkan'
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

    handleClearNewVendor = () => {
        this.setState({newVendor:
            {
                vendorID: "",
                name: "",
                address: "",
                npwp: "",
                category: "",
                contact_person: {
                    Name : "",
                    Email : "",
                    Whatsapp :"",
                    HP : ""
                },
                email: ""
            }
        })    
    }

    handleEditModeClick = () => {
        this.setState({editMode : true})
    }

    handleEditVendorSubmit = async () => {
        let result = await VendorService.editVendor(this.state.selectedVendor)
        console.log(result)
        if(result.status == 200){
            await this.props.fetchVendorList()
            await this.props.editSelectedVendor(this.state.selectedVendor.vendorID)
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

    handleDeleteVendorClick = async () => {
        let confirmed = await swal(`Apakah anda yakin akan menghapus ${this.state.selectedVendor.vendorID} dari daftar proyek ?`, 
                                    {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                );
        if(confirmed){
            let result = await VendorService.deleteVendor({vendorID : this.state.selectedVendor.vendorID})
            if(result.status == 200){
                await iziToast.success({
                    title: this.state.selectedVendor.vendorID,
                    position: 'bottomRight',
                    message: `telah berhasil dihapus dari daftar proyek`
                });
                await this.props.fetchVendorList()
                await this.props.clearSelectedVendor()
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
                selectedVendor : Object.assign({}, props.selectedVendor),
                prevSelectedVendor : Object.assign({}, props.selectedVendor),
                newVendor : {
                    vendorID: "",
                    name: "",
                    address: "",
                    npwp: "",
                    category: "",
                    contact_person: {
                        Name : "",
                        Email : "",
                        Whatsapp :"",
                        HP : ""
                    },
                    email: ""
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
        let vendorList = this.props.vendorList
        console.log(vendorList)
        for(let i=0; i<vendorList.length; i++){
            let ID = parseInt((vendorList[i].vendorID).slice(-5))
            if(ID>latestID){
                latestID = ID
            }
        }
        let newID = 'VND'+((latestID+1).toString()).padStart(5,'0')

        //render vandor categories
        let categoryList = ['SPAREPART', 'BBM', 'SEMEN']
        let businesses = []
        for(let i=0; i<categoryList.length; i++){
            businesses = [...businesses, {key:categoryList[i], value:categoryList[i], text:categoryList[i]}]
        }

        //render vendor cp
        let contact_person_render = ''
        if(this.state.selectedVendor.contact_person){
            contact_person_render = Object.keys(this.props.selectedVendor.contact_person).map( (key)=> {
                console.log(key)
                console.log(this.state.selectedVendor.contact_person[key])
                return (<div id="cpName" className="form-control-1" key={key}>
                            <label htmlFor={key}>{key}</label>
                            <Input name={key} placeholder={key} subclass="contactPerson" readOnly={!this.state.editMode}
                                    value={this.state.selectedVendor.contact_person[key]} onChange={this.handleSelectedVendorChange.bind(this)}/>
                        </div>)
            })
        }
        
        if(equal(this.props.selectedVendor,{})){
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="newVendor">
                        <div className="title">
                                <i className="material-icons">people</i>
                                <span>Tambah Vendor</span>
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
                                <span>Informasi Vendor</span>
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
                            {contact_person_render}
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
        selectedVendor : Object.assign({},state.vendorReducer.selectedVendor),
        vendorList : [...state.vendorReducer.vendorList],
        currentUser : Object.assign({},state.authenticationReducer.currentUser),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSelectedVendor : async (vID) => {
            let fetchedData = await VendorService.getVendor({vendorID : vID})
            if(fetchedData.status === 200){
                await dispatch({type : "UPDATE_SELECTED_VENDOR", payload : fetchedData.data})
            }
        },
        clearSelectedVendor : async () => {
            await dispatch({type : "UPDATE_SELECTED_VENDOR", payload : {}})
        },
        fetchVendorList : async () => {
            let fetchedList = await VendorService.getVendors();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_VENDOR_LIST', payload : fetchedList.data});
            }
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(AssetDisplay);