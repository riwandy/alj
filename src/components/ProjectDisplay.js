import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import AuthenticationService from '../services/AuthenticationService'
import ClientService from '../services/ClientService'
import { Input,Header,Button,Select,TextArea,Label,Form,Segment } from 'semantic-ui-react'
import { DateInput,TimeInput,DateTimeInput,DatesRangeInput } from 'semantic-ui-calendar-react';
import swal from 'sweetalert';
import iziToast from 'izitoast';
import equal from 'deep-equal';
import styles from './css/ProjectDisplay.css';
import ProjectService from '../services/ProjectService';

class ProjectDisplay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            selectedProject : {},
            prevSelectedProject : {},
            newProject : {
                projectID: "",
                clientID: "",
                supervisor: "",
                contract: "",
                category: "",
                location: "",
                price: "",
                start_date: "",
                duration: "",
                detail: "",
                status: ""
            }
        }
    }

    //eventhandler function
    handleSelectedProjectChange (e,{name,value}) {
        let newState = Object.assign({},this.state.selectedProject)
        newState[name] = value;
        this.setState({selectedProject : newState})
    }
    
    handleNewProjectChange(e,{value,name}) {
        let newState = Object.assign({},this.state.newProject)
        newState[name] = value;
        this.setState({newProject : newState})
    }

    handleAddProject = async (newID) => {
        let result = await ProjectService.addProject({...this.state.newProject, projectID : newID})
        if(result.status == 200){
            await this.props.fetchProjectList()
            await this.setState({newProject : 
                {
                    projectID: "",
                    clientID: "",
                    supervisor: "",
                    contract: "",
                    category: "",
                    location: "",
                    price: "",
                    start_date: "",
                    duration: "",
                    detail: "",
                    status: ""
                }
            })
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Protek baru telah berhasil didaftarkan'
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

    handleClearNewProject = () => {
        this.setState({newProject:
            {
                projectID: "",
                clientID: "",
                supervisor: "",
                contract: "",
                category: "",
                location: "",
                price: "",
                start_date: "",
                duration: "",
                detail: "",
                status: ""
            }
        })    
    }

    handleEditModeClick = () => {
        this.setState({editMode : true})
    }

    handleEditProjectSubmit = async () => {
        let result = await ProjectService.editProject(this.state.selectedProject)
        if(result.status == 200){
            await this.props.fetchProjectList()
            await this.props.editSelectedProject(this.state.selectedProject.projectID)
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

    handleDeleteProjectClick = async () => {
        let confirmed = await swal(`Apakah anda yakin akan menghapus ${this.state.selectedProject.projectID} dari daftar proyek ?`, 
                                    {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                );
        if(confirmed){
            await ProjectService.deleteProject({projectID : this.state.selectedProject.projectID})
            if(confirmed.status == 200){
                await iziToast.success({
                    title: this.state.selectedProject.projectID,
                    position: 'bottomRight',
                        message: `telah berhasil dihapus dari daftar proyek`
                });
                await this.props.fetchProjectList()
                await this.props.clearSelectedProject()
            }else{
                await iziToast.error({
                    title: this.state.selectedProject.projectID,
                    position: 'bottomRight',
                    message: `gagal dihapus dari daftar proyek`
                });
            }
        }
            
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.selectedProject,state.prevSelectedProject)){
            return {
                selectedProject : Object.assign({}, props.selectedProject),
                prevSelectedProject : Object.assign({}, props.selectedProject),
                newUser : {username:'', employeeID:'', password:''},
                editMode : false
            }
        }else{
            return null
        }
    }

    render() {
        //render dynamic options for clientID
        let clientList = this.props.clientList
        let clientNames = []
        for(let i=0; i<clientList.length; i++){
            clientNames = [...clientNames, {key:clientList[i].clientID, value:clientList[i].clientID, text:clientList[i].name}]
        }

        console.log(clientNames)

        //render dynamic options for employeeID
        let employeeList = this.props.employeeList
        let employeeNames = []
        for(let i=0; i<employeeList.length; i++){
            employeeNames = [...employeeNames, {key:employeeList[i].employeeID, value:employeeList[i].employeeID, text:employeeList[i].name}]
        }

        //render categories list
        let categoryList = ['SIPIL', 'EARTHWORKS', 'PERUMAHAN']
        let categories = []
        for(let i=0; i<categoryList.length; i++){
            categories = [...categories, {key:categoryList[i], value:categoryList[i], text:categoryList[i]}]
        }

        //render status list
        let statusList = ['SURVEY', 'PERSIAPAN', 'PENGERJAAN', 'PENYELESAIAN', 'SELESAI']
        let status = []
        for(let i=0; i<statusList.length; i++){
            status = [...status, {key:statusList[i], value:statusList[i], text:statusList[i]}]
        }

        //get new projectID
        let latestID = 0
        let projectList = this.props.projectList
        for(let i=0; i<projectList.length; i++){
            let ID = parseInt((projectList[i].projectID).slice(-5))
            if(ID>latestID){
                latestID = ID
            }
        }
        let newID = 'PRJ'+((latestID+1).toString()).padStart(5,'0')

        if(equal(this.props.selectedProject,{})){
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="newProject">
                            <div className="title">
                                <i className="material-icons">people</i>
                                <span>Proyek Baru</span>
                                <span className="titleID"><b>{newID}</b></span>
                            </div>
                            <div id="contract" className="form-control-1">
                                <label htmlFor="contract">Kontrak</label>
                                <Input name="contract" placeholder='Contract'
                                        value={this.state.newProject.contract} onChange={this.handleNewProjectChange.bind(this)}/>
                            </div>
                            <div id="styles.employeeID" className="form-control-1">
                                <label htmlFor="supervisor">Supervisor</label>
                                <Select name="supervisor" placeholder='Supervisor' options={employeeNames} search
                                        value={this.state.newProject.supervisor} onChange={this.handleNewProjectChange.bind(this)}/>
                            </div>
                            <div id="clientID" className="form-control-1">
                                <label htmlFor="clientID">Klien</label>
                                <Select name="clientID" placeholder='Client' options={clientNames} search
                                        value={this.state.newProject.clientID} onChange={this.handleNewProjectChange.bind(this)}/>
                            </div>
                            <div id="category" className="form-control-1">
                                <label htmlFor="category">Kategori</label>
                                <Select name="category" placeholder='Client' options={categories} search
                                        value={this.state.newProject.category} onChange={this.handleNewProjectChange.bind(this)}/>
                            </div>
                            <div id="location" className="form-control-1">
                                <label htmlFor="location">Lokasi</label>
                                <Form>
                                    <TextArea name="location" placeholder='lokasi'
                                            value={this.state.newProject.location} onChange={this.handleNewProjectChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="price" className="form-control-1">
                                <label htmlFor="price">Harga</label>
                                <Input name="price" placeholder='Harga' labelPosition='left' label='Rp'
                                        value={this.state.newProject.price} onChange={this.handleNewProjectChange.bind(this)}>
                                </Input>
                            </div>
                            <div id="start_date" className="form-control-1">
                                <label htmlFor="start_date">Tanggal Mulai</label>
                                <DateInput
                                        name="start_date" closable dateFormat="YYYY-MM-DD"
                                        placeholder="Date" popupPosition="bottom left"
                                        value={this.state.newProject.start_date}
                                        iconPosition="left" onChange={this.handleNewProjectChange.bind(this)} />
                            </div>
                            <div id="duration" className="form-control-1">
                                <label htmlFor="duration">Durasi</label>
                                <Input name="duration" placeholder='Durasi' labelPosition='right' label='BULAN'
                                        value={this.state.newProject.duration} onChange={this.handleNewProjectChange.bind(this)}>
                                </Input>
                            </div>
                            <div id="detail" className="form-control-1">
                                <label htmlFor="detail">Detail</label>
                                <Form>
                                    <TextArea name="detail" placeholder='Detail' 
                                            value={this.state.newProject.detail} onChange={this.handleNewProjectChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="status" className="form-control-1">
                                <label htmlFor="status">Status</label>
                                <Select name="status" placeholder='Status' options={status} search
                                        value={this.state.newProject.status} onChange={this.handleNewProjectChange.bind(this)}/>
                            </div>
                            <div className="new-controls">
                                <Button icon="add" onClick={()=>this.handleAddProject(newID)} color="green"/>
                                <Button icon="cancel" nClick={this.handleClearNewProject} color="red"/>
                            </div>
                        </Segment>
                    </div>
                </div>
            )
        } else{
            return (
                <div className="display">
                    <div className="display-data">
                        <Segment id="projectDetail">
                            <span id="title">
                                <i className="material-icons">people</i>
                                <span>Informasi Proyek</span>
                            </span>
                            <span id="projectID"><b>{this.state.selectedProject.projectID}</b></span>
                            <div id="contract" className="form-control-1">
                                <label htmlFor="contract">Kontrak</label>
                                <Input name="contract" placeholder='Contract' disabled={!this.state.editMode}
                                        value={this.state.selectedProject.contract} onChange={this.handleSelectedProjectChange.bind(this)}/>
                            </div>
                            <div id="styles.employeeID" className="form-control-1">
                                <label htmlFor="supervisor">Supervisor</label>
                                <Select name="supervisor" placeholder='Supervisor' options={employeeNames} disabled={!this.state.editMode} search
                                        value={this.state.selectedProject.supervisor} onChange={this.handleSelectedProjectChange.bind(this)}/>
                            </div>
                            <div id="clientID" className="form-control-1">
                                <label htmlFor="clientID">Klien</label>
                                <Select name="clientID" placeholder='Client' options={clientNames} disabled={!this.state.editMode} search
                                        value={this.state.selectedProject.clientID} onChange={this.handleSelectedProjectChange.bind(this)}/>
                            </div>
                            <div id="category" className="form-control-1">
                                <label htmlFor="category">Kategori</label>
                                <Select name="category" placeholder='Client' options={categories} disabled={!this.state.editMode} search
                                        value={this.state.selectedProject.category} onChange={this.handleSelectedProjectChange.bind(this)}/>
                            </div>
                            <div id="location" className="form-control-1">
                                <label htmlFor="location">Lokasi</label>
                                <Form>
                                    <TextArea name="location" placeholder='lokasi' readOnly={!this.state.editMode}
                                            value={this.state.selectedProject.location} onChange={this.handleSelectedProjectChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="price" className="form-control-1">
                                <label htmlFor="price">Harga</label>
                                <Input name="price" placeholder='Harga' readOnly={!this.state.editMode} labelPosition='left' label='Rp'
                                        value={this.state.selectedProject.price} onChange={this.handleSelectedProjectChange.bind(this)}>
                                </Input>
                            </div>
                            <div id="start_date" className="form-control-1">
                                <label htmlFor="start_date">Tanggal Mulai</label>
                                <DateInput
                                        name="start_date" closable readOnly={!this.state.editMode}
                                        placeholder="Date" popupPosition="bottom left" dateFormat="YYYY-MM-DD"
                                        value={this.state.selectedProject.start_date}
                                        iconPosition="left" disabled={!this.state.editMode}
                                        onChange={this.handleSelectedProjectChange.bind(this)} />
                            </div>
                            <div id="duration" className="form-control-1">
                                <label htmlFor="duration">Durasi</label>
                                <Input name="duration" placeholder='Harga' readOnly={!this.state.editMode} labelPosition='right' label='BULAN'
                                        value={this.state.selectedProject.duration} onChange={this.handleSelectedProjectChange.bind(this)}>
                                </Input>
                            </div>
                            <div id="detail" className="form-control-1">
                                <label htmlFor="detail">Detail</label>
                                <Form>
                                    <TextArea name="detail" placeholder='Detail' disabled={!this.state.editMode}
                                            value={this.state.selectedProject.detail} onChange={this.handleSelectedProjectChange.bind(this)}/>
                                </Form>
                            </div>
                            <div id="status" className="form-control-1">
                                <label htmlFor="status">Status</label>
                                <Select name="status" placeholder='Status' disabled={!this.state.editMode} options={status} search
                                        value={this.state.selectedProject.status} onChange={this.handleSelectedProjectChange.bind(this)}/>
                            </div>
                        </Segment>
                    </div>
                    <div id="controls">
                            <Button circular onClick={this.handleEditModeClick}
                                    disabled={this.state.editMode} icon='edit'
                                    className="button is-primary" color='green' />
                            <Button circular onClick={this.handleEditProjectSubmit} icon='save'
                                    disabled={equal(this.props.selectedProject, this.state.selectedProject) ? true : false}
                                    color="blue" /> 
                            <Button circular onClick={this.handleDeleteProjectClick} icon='delete' color='red' />
                    </div>
                </div>
            )

        }
    }
}

const mapStateToProps = (state) => {
    return {
        selectedProject : Object.assign({},state.projectReducer.selectedProject),
        currentUser : Object.assign({},state.authenticationReducer.currentUser),
        projectList : [...state.projectReducer.projectList],
        clientList : [...state.clientReducer.clientList],
        employeeList : [...state.employeeReducer.employeeList]
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSelectedProject : async (pID) => {
            let fetchedData = await ProjectService.getProject({projectID : pID})
            if(fetchedData.status === 200){
                await dispatch({type : "UPDATE_SELECTED_PROJECT", payload : fetchedData.data})
            }
        },
        clearSelectedProject : async () => {
            await dispatch({type : "UPDATE_SELECTED_PROJECT", payload : {}})
        },
        fetchProjectList : async () => {
            let fetchedList = await ProjectService.getProjects();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_PROJECT_LIST', payload : fetchedList.data});
            }
        },
        fetchClientList : async () => {
            let fetchedList = await ClientService.getClients();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_CLIENT_LIST', payload : fetchedList.data});
            }
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ProjectDisplay);