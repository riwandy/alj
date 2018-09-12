import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import ClientService from '../services/ClientService'
import { Input,Header,Button,Select,TextArea,Label,Form,Segment,Dropdown } from 'semantic-ui-react'
import { DateInput,TimeInput,DateTimeInput,DatesRangeInput } from 'semantic-ui-calendar-react';
import swal from 'sweetalert';
import iziToast from 'izitoast';
import equal from 'deep-equal';
import styles from './css/ClientDisplay.css';

class ClientDisplay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            selectedClient : {},
            prevSelectedClient : {},
            newClient : {
                clientID: "",
                name: "",
                address: "",
                npwp: "",
                business: [],
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
    handleSelectedClientChange (e,{name,value,subclass}) {
        let newState = Object.assign({},this.state.selectedClient)
        if(subclass == 'contactPerson'){
            let subState = Object.assign({},this.state.selectedClient.contact_person)
            subState[name] = value;
            newState.contact_person = subState;
        }
        else{
            newState[name] = value;
        }
        this.setState({selectedClient : newState})
    }
    
    handleNewClientChange(e,{value,name,subclass}) {
        let newState = Object.assign({},this.state.newClient)
        if(subclass == 'contactPerson'){
            let subState = Object.assign({},this.state.newClient.contact_person)
            subState[name] = value;
            newState.contact_person = subState;           
        }else{
            newState[name] = value;
        }
        this.setState({newClient : newState})
    }

    handleAddClient = async (newID) => {
        let result = await ClientService.addClient({...this.state.newClient, clientID : newID})
        if(result.status == 200){
            await this.props.fetchClientList()
            await this.setState({newClient : 
                {
                    clientID: "",
                    name: "",
                    address: "",
                    npwp: "",
                    business: [],
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
                    message: 'Klien baru telah berhasil didaftarkan'
                });
        }else{
            console.log(result.data.error)
            for(let i=0; i<result.data.error.length; i++){
                iziToast.error({
                        title: 'Gagal',
                        position: 'bottomRight',
                        message: result.data.error[i]
                    });
            }
        }
    }

    handleClearNewClient = () => {
        this.setState({newClient:
            {
                clientID: "",
                name: "",
                address: "",
                npwp: "",
                business: [],
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

    handleEditClientSubmit = async () => {
        let result = await ClientService.editClient(this.state.selectedClient)
        if(result.status == 200){
            await this.props.fetchClientList()
            await this.props.editSelectedClient(this.state.selectedClient.clientID)
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

    handleDeleteClientClick = async () => {
        let confirmed = await swal(`Apakah anda yakin akan menghapus ${this.state.selectedClient.clientID} dari daftar klien ?`, 
                                    {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                );
        if(confirmed){
            let result = await ClientService.deleteClient({clientID : this.state.selectedClient.clientID})
            if(result.status == 200){
                await iziToast.success({
                    title: this.state.selectedClient.clientID,
                    position: 'bottomRight',
                    message: `telah berhasil dihapus dari daftar proyek`
                });
                await this.props.fetchClientList()
                await this.props.clearSelectedClient()
            }else{
                await iziToast.error({
                    title: this.state.selectedClient.clientID,
                    position: 'bottomRight',
                    message: `gagal dihapus dari daftar proyek`
                });
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.selectedClient,state.prevSelectedClient)){
            return {
                selectedClient : Object.assign({}, props.selectedClient),
                prevSelectedClient : Object.assign({}, props.selectedClient),
                newClient : {
                    clientID: "",
                    name: "",
                    address: "",
                    npwp: "",
                    business: [],
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
        //get new clientID
        let latestID = 0
        let clientList = this.props.clientList
        for(let i=0; i<clientList.length; i++){
            let ID = parseInt((clientList[i].clientID).slice(-5))
            if(ID>latestID){
                latestID = ID
            }
        }
        let newID = 'CLN'+((latestID+1).toString()).padStart(5,'0')

        //render client categories
        let categoryList = ['EARTHWORKS', 'SIPIL', 'PERUMAHAN']
        let businesses = []
        for(let i=0; i<categoryList.length; i++){
            businesses = [...businesses, {key:categoryList[i], value:categoryList[i], text:categoryList[i]}]
        }

        //render client cp
        let contact_person_render = ''
        if(this.state.selectedClient.contact_person){
            contact_person_render = Object.keys(this.props.selectedClient.contact_person).map( (key)=> {
                return (<div id="cpName" className="form-control-1" key={key}>
                            <label htmlFor={key}>{key}</label>
                            <Input name={key} placeholder={key} subclass="contactPerson" readOnly={!this.state.editMode}
                                    value={this.state.selectedClient.contact_person[key]} onChange={this.handleSelectedClientChange.bind(this)}/>
                        </div>)
            })
        }
        
        if(equal(this.props.selectedClient,{})){
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="newClient">
                        <div className="title">
                                <i className="material-icons">people</i>
                                <span>Tambah Klien</span>
                                <span className="titleID"><b>{newID}</b></span>
                            </div>
                            <div id="name" className="form-control-1">
                                <label htmlFor="name">Nama</label>
                                <Input name="name" placeholder='Nama'
                                        value={this.state.newClient.name} onChange={this.handleNewClientChange.bind(this)}/>
                            </div>
                            <div id="address" className="form-control-1">
                                <label htmlFor="address">Alamat</label>
                                <Form>
                                    <TextArea name="address" placeholder='Alamat'
                                            value={this.state.newClient.address} onChange={this.handleNewClientChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="npwp" className="form-control-1">
                                <label htmlFor="npwp">NPWP</label>
                                <Input name="npwp" placeholder='NPWP'
                                        value={this.state.newClient.npwp} onChange={this.handleNewClientChange.bind(this)}/>
                            </div>
                            <div id="business" className="form-control-1">
                                <label htmlFor="business">Kategori</label>
                                <Dropdown placeholder='Skills' name="business" fluid multiple selection options={businesses} 
                                value={this.state.newClient.business} onChange={this.handleNewClientChange.bind(this)}/>
                            </div>
                            <div id="email" className="form-control-1">
                                <label htmlFor="email">Email</label>
                                <Input name="email" placeholder='Email'
                                        value={this.state.newClient.email} onChange={this.handleNewClientChange.bind(this)}/>
                            </div>
                            <Segment className="contactPerson">
                            <h4>Contact Person</h4>
                                <div id="cpName" className="form-control-1">
                                    <label htmlFor="email">Nama</label>
                                    <Input name="Name" placeholder='Nama' subclass="contactPerson"
                                            value={this.state.newClient.contact_person.Name} onChange={this.handleNewClientChange.bind(this)}/>
                                </div>
                                <div id="cpHP" className="form-control-1">
                                    <label htmlFor="HP">HP</label>
                                    <Input name="HP" placeholder='Email' subclass="contactPerson"
                                            value={this.state.newClient.contact_person.HP} onChange={this.handleNewClientChange.bind(this)}/>
                                </div>
                                <div id="cpWhatsapp" className="form-control-1">
                                    <label htmlFor="Whatsapp">Whatsapp</label>
                                    <Input name="Whatsapp" placeholder='Whatsapp' subclass="contactPerson"
                                            value={this.state.newClient.contact_person.Whatsapp} onChange={this.handleNewClientChange.bind(this)}/>
                                </div>
                                <div id="cpEmail" className="form-control-1">
                                    <label htmlFor="Email">Email</label>
                                    <Input name="Email" placeholder='Email' subclass="contactPerson"
                                            value={this.state.newClient.contact_person.Email} onChange={this.handleNewClientChange.bind(this)}/>
                                </div>
                            </Segment>

                            <div className="new-controls">
                                <Button icon="add" onClick={()=>this.handleAddClient(newID)} color="green"/>
                                <Button icon="cancel" onClick={this.handleClearNewClient} color="red"/>
                            </div>
                        </Segment>
                    </div>
                </div>
            )
        } else{
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="clientDetail">
                            <div className="title">
                                <i className="material-icons">people</i>
                                <span>Informasi Klien</span>
                                <span className="titleID"><b>{this.state.selectedClient.clientID}</b></span>
                            </div>
                            <div id="name" className="form-control-1">
                                <label htmlFor="name">Nama</label>
                                <Input name="name" placeholder='Nama' readOnly={!this.state.editMode}
                                        value={this.state.selectedClient.name} onChange={this.handleSelectedClientChange.bind(this)}/>
                            </div>
                            <div id="address" className="form-control-1">
                                <label htmlFor="address">Alamat</label>
                                <Form>
                                    <TextArea name="address" placeholder='Alamat' readOnly={!this.state.editMode}
                                            value={this.state.selectedClient.address} onChange={this.handleSelectedClientChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="npwp" className="form-control-1">
                                <label htmlFor="npwp">NPWP</label>
                                <Input name="npwp" placeholder='NPWP' readOnly={!this.state.editMode}
                                        value={this.state.selectedClient.npwp} onChange={this.handleSelectedClientChange.bind(this)}/>
                            </div>
                            <div id="business" className="form-control-1">
                                <label htmlFor="business">Kategori</label>
                                <Dropdown placeholder='Skills' name="business" fluid multiple selection options={businesses} options={businesses}
                                disabled={!this.state.editMode} value={this.state.selectedClient.business} onChange={this.handleSelectedClientChange.bind(this)}/>
                            </div>
                            <div id="email" className="form-control-1">
                                <label htmlFor="email">Email</label>
                                <Input name="email" placeholder='Email' readOnly={!this.state.editMode}
                                        value={this.state.selectedClient.email} onChange={this.handleSelectedClientChange.bind(this)}/>
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
                            <Button circular onClick={this.handleEditClientSubmit} icon='save'
                                    disabled={(
                                        equal(this.props.selectedClient, this.state.selectedClient) && 
                                        equal(this.props.selectedClient.contact_person, this.state.selectedClient.contact_person)
                                    ) ? true : false}
                                    color="blue" /> 
                            <Button circular onClick={this.handleDeleteClientClick} icon='delete' color='red' />
                    </div>
                </div>
            )

        }
    }
}

const mapStateToProps = (state) => {
    return {
        selectedClient : Object.assign({},state.clientReducer.selectedClient),
        clientList : [...state.clientReducer.clientList],
        currentUser : Object.assign({},state.authenticationReducer.currentUser),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSelectedClient : async (cID) => {
            let fetchedData = await ClientService.getClient({clientID : cID})
            if(fetchedData.status === 200){
                await dispatch({type : "UPDATE_SELECTED_CLIENT", payload : fetchedData.data})
            }
        },
        clearSelectedClient : async () => {
            await dispatch({type : "UPDATE_SELECTED_CLIENT", payload : {}})
        },
        fetchClientList : async () => {
            let fetchedList = await ClientService.getClients();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_CLIENT_LIST', payload : fetchedList.data});
            }
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ClientDisplay);