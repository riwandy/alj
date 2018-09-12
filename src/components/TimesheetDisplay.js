import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import equal from 'deep-equal';
import swal from 'sweetalert';
import iziToast from 'izitoast';
import { Button,Image,Modal,Header,Input,Dropdown,TextArea } from 'semantic-ui-react';
import { DateInput,TimeInput,DateTimeInput,DatesRangeInput } from 'semantic-ui-calendar-react';
import './css/TimesheetDisplay.css'
import EmployeeService from '../services/EmployeeService'
import TimesheetService from '../services/TimesheetService'
import ProjectService from '../services/ProjectService';

class TimesheetDisplay extends Component{
    constructor(props){
        super(props);
        this.state = {
            employeeList : [],
            projectList : [],
            selectedEmployee : '',
            selectedProject : '',
            employeeTimesheet : [],
            projectTimesheet : [],
            newTimesheetModalOpen : false,
            editTimesheetModalOpen : false,
            newTimesheet : {
                date : '',
                projectID : '',
                hours : '',
                detail : ''
            },
            editTimesheet : {
                date : '',
                projectID : '',
                hours : '',
                detail : ''
            }
        }
    }

    handleEmployeeCardClick = async (eID) => {
        this.props.updateDisplayState('employee-detailed')
        this.setState({selectedEmployee: eID})
        this.props.fetchEmployeeTimesheet(eID)
        this.setState({employeeTimesheet : [].concat(this.props.employeeTimesheet)})
        this.props.updateSearch('')
    }

    handleProjectCardClick = async (pID) => {
        this.props.updateDisplayState('project-detailed')
        this.setState({selectedProject: pID})
        this.props.fetchProjectTimesheet(pID)
        this.setState({projectTimesheet : [].concat(this.props.projectTimesheet)})
        this.props.updateSearch('')
    }
    
    handleTimesheetDelete = async (id) => {
        try{
            let confirmed = await swal(`Apakah anda yakin akan menghapus timesheet ini ?`, 
                                        {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                    );
            if(confirmed){
                await TimesheetService.deleteTimesheet({'id' : id})
                await this.props.fetchEmployeeTimesheet(this.state.selectedEmployee)
                await this.props.fetchProjectTimesheet(this.state.selectedProject)
                iziToast.success({
                        title: 'Sukses',
                        position: 'bottomRight',
                        message: `timesheet telah berhasil dihapus `
                    });
            }
        }catch(err){

        }
    }

    handleTimesheetEdit = async (id) => {
        try{
            let confirmed = await swal(`Apakah anda yakin akan mengubah timesheet ini ?`, 
                                        {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                    );
            if(confirmed){
                console.log(this.state.editTimesheet)
                await TimesheetService.editTimesheet(this.state.editTimesheet)
                if(this.props.displayState=='employee-detailed'){
                    await this.props.fetchEmployeeTimesheet(this.state.selectedEmployee)
                }else{
                    await this.props.fetchProjectTimesheet(this.state.selectedProject)
                }
                iziToast.success({
                        title: 'Sukses',
                        position: 'bottomRight',
                        message: `timesheet telah berhasil diubah `
                    });
                this.setState({editTimesheetModalOpen:false})
                    
            }
        }catch(err){
            iziToast.error({
                    title: 'Gagal',
                    position: 'bottomRight',
                    message: 'Tidak dapat mengubah timesheet'
                });
                console.log(err.message)
        }
    }

    handleNewTimesheetDataChange = (e,{name,value}) => {
        let newValue = {}
        newValue[name] = value
        this.setState({newTimesheet:Object.assign(this.state.newTimesheet,newValue)})
    }

    handleEditTimesheetDataChange = (e,{name,value}) => {
        let newValue = {}
        newValue[name] = value
        this.setState({editTimesheet:Object.assign(this.state.editTimesheet,newValue)})
    }

    handleAddEmployeeTimesheet = async () => {
        try{
            let newTimesheet = await TimesheetService.addTimesheet(Object.assign(this.state.newTimesheet,{employeeID : this.state.selectedEmployee}))
            console.log(newTimesheet.data.error)
            if(newTimesheet.status!==200){
                throw newTimesheet.data
            }
            await this.props.fetchEmployeeTimesheet()
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Timesheet baru telah berhasil ditambahkan'
                });
            this.props.fetchEmployeeTimesheet(this.state.selectedEmployee)
            this.setState({employeeTimesheet : [].concat(this.props.employeeTimesheet)})
            this.setState({newTimesheetModalOpen:false})
        }catch(err){
            iziToast.error({
                    title: 'Gagal',
                    position: 'bottomRight',
                    message: 'Tidak dapat menambahkan timesheet'
                });
                console.log(err.message)
        }
    }

    handleAddProjectTimesheet = async () => {
        try{
            let newTimesheet = await TimesheetService.addTimesheet(Object.assign(this.state.newTimesheet,{projectID : this.state.selectedProject}))
            console.log(newTimesheet.data.error)
            if(newTimesheet.status!==200){
                throw newTimesheet.data
            }
            await this.props.fetchEmployeeTimesheet()
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Timesheet baru telah berhasil ditambahkan'
                });
            this.props.fetchProjectTimesheet(this.state.selectedProject)
            this.setState({projectTimesheet : [].concat(this.props.projectTimesheet)})
            this.setState({newTimesheetModalOpen:false})
        }catch(err){
            iziToast.error({
                    title: 'Gagal',
                    position: 'bottomRight',
                    message: 'Tidak dapat menambahkan timesheet'
                });
                console.log(err.message)
        }
    }

    handleOpenEmployeeModal = ()=>{
        this.props.fetchProjectList()
        this.setState({newTimesheetModalOpen:true})
        this.setState({newTimesheet : {
            date : '',
            projectID : '',
            hours : '',
            detail : ''
        }})
    }

    handleOpenEditEmployeeModal = async (id)=>{
        this.props.fetchProjectList()
        let fetchedTimesheet = await TimesheetService.getTimesheet({'id':id})
        // console.log(fetchedTimesheet)
        this.setState({editTimesheetModalOpen:true})
        this.setState({editTimesheet : fetchedTimesheet.data[0]})
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props,state)){
            return {
                employeeList : [].concat(props.employeeList),
                projectList : [].concat(props.projectList),
            }
        }else{
            return null
        }
    }
    render(){
        switch (this.props.displayState){
            case 'project' : {
                let projectList = this.state.projectList
                let filterProject = (projectList).filter((project)=>{
                    return (project.location.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (project.contract.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (project.projectID.toUpperCase()).match((this.props.search.toString()).toUpperCase())
                })
                let projectCards = filterProject.map((project, i)=>{
                    return (
                        <div key={project.projectID} className="card" onClick={()=>{this.handleProjectCardClick(project.projectID)}}>
                            <div className="photo">
                            </div>
                            <div className="data">
                                <p><b>{project.projectID}</b></p>
                                <p>{project.contract}</p>
                                <p>{project.location}</p>
                            </div>
                        </div>   
                    )
                })
                return(
                    <div className='project-cards-wrapper'>
                        {projectCards}
                    </div>
                )
            }
            case 'project-detailed' : {
                //get selectedEmployee Object
                let projects = this.state.projectList
                let selectedProjectID = this.state.selectedProject
                if(!selectedProjectID){
                    this.props.updateDisplayState('project')
                    return null
                }
                let selectedProject = projects.filter((project)=>{
                    return project.projectID === selectedProjectID
                })
                selectedProject = selectedProject[0]

                //get projectTimesheet and render table
                let ProjectTimesheet = this.props.projectTimesheet
                console.log(ProjectTimesheet)
                let filterTimesheet = (ProjectTimesheet).filter((timesheet)=>{
                    return (timesheet.detail.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (timesheet.Employee.name.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (timesheet.Employee.employeeID.toUpperCase()).match((this.props.search.toString()).toUpperCase())
                })
                let timesheetDetail = filterTimesheet.map((timesheet)=>{
                    console.log(timesheet)
                    return (
                        <tr key={timesheet.id}>
                            <td>{timesheet.Employee.employeeID} - {timesheet.Employee.name}</td>
                            <td>{timesheet.date}</td>
                            <td>{timesheet.hours}</td>
                            <td>{timesheet.detail}</td>
                            <td>
                                <a><i className='material-icons' onClick={()=>{this.handleOpenEditEmployeeModal(timesheet.id)}}>edit</i></a>
                                <a><i className='material-icons' onClick={()=>{this.handleTimesheetDelete(timesheet.id)}}>delete</i></a>
                            </td>
                        </tr>
                    )
                })

                //render project selection
                let employeeList = this.props.employeeList
                let employeeRender =[]
                for(let i=0; i<employeeList.length; i++){
                    employeeRender = [...employeeRender,{key:employeeList[i].employeeID, text:employeeList[i].name, value:employeeList[i].employeeID}]
                }
                console.log(employeeRender)
                return(
                    <div className='detail-wrapper'>
                        <div className="control-detail">
                            <div>
                                <Button inverted color="red" onClick={()=>{this.props.updateDisplayState('project')
                                                    this.props.updateSearch('')}}>Kembali</Button>
                                <Button inverted color="green" onClick={this.handleOpenEmployeeModal}>Tambah</Button>
                            </div>
                            <p><b>
                                {selectedProject.projectID} - {selectedProject.location}
                            </b></p>
                        </div>
                        <Modal size='small' open={this.state.newTimesheetModalOpen}>
                            <Modal.Header>Tambah Timesheet</Modal.Header>
                            <Modal.Content scrolling>
                            <div className='form-control-1'>
                                    <label>Karyawan</label>
                                    <Dropdown placeholder='Pilih Karyawan' name='employeeID'
                                              fluid search selection options={employeeRender}
                                              value={this.state.newTimesheet.employeeID}
                                              onChange={this.handleNewTimesheetDataChange}/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Tanggal</label>
                                    <DateInput
                                        name="date" closable
                                        placeholder="Date" popupPosition="bottom left"
                                        value={this.state.newTimesheet.date}
                                        iconPosition="left" dateFormat="YYYY-MM-DD"
                                        onChange={this.handleNewTimesheetDataChange} />
                                </div>
                                <div className='form-control-1'>
                                    <label>Jumlah Jam</label>
                                    <Input onChange={this.handleNewTimesheetDataChange} 
                                           value={this.state.newTimesheet.hours} name="hours"/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Keterangan</label>
                                    <TextArea rows={4} placeholder='Tell us more'
                                              onChange={this.handleNewTimesheetDataChange} 
                                              value={this.state.newTimesheet.detail} name="detail"/>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button positive onClick={this.handleAddProjectTimesheet}>
                                    Tambahkan
                                </Button>
                                <Button negative onClick={()=>{this.setState({newTimesheetModalOpen:false})}}>
                                    Batal
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Karyawan</th>
                                    <th>Tanggal</th>
                                    <th>Jumlah Jam</th>
                                    <th>Keterangan</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {timesheetDetail}
                            </tbody>
                        </table>
                        <Modal size='small' open={this.state.editTimesheetModalOpen}>
                            <Modal.Header>Ubah Timesheet</Modal.Header>
                            <Modal.Content scrolling>
                                <div className='form-control-1'>
                                    <label>Karyawan</label>
                                    <Dropdown placeholder='Pilih karyawan' name='employeeID'
                                              fluid search selection options={employeeRender}
                                              value={this.state.editTimesheet.employeeID}
                                              onChange={this.handleEditTimesheetDataChange}/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Tanggal</label>
                                    <DateInput
                                        name="date" closable
                                        placeholder="Date" popupPosition="bottom left"
                                        value={this.state.editTimesheet.date}
                                        iconPosition="left" dateFormat="MM-DD-YYYY"
                                        onChange={this.handleEditTimesheetDataChange} />
                                </div>
                                <div className='form-control-1'>
                                    <label>Jumlah Jam</label>
                                    <Input onChange={this.handleEditTimesheetDataChange} 
                                           value={this.state.editTimesheet.hours} name="hours"/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Keterangan</label>
                                    <TextArea rows={4} placeholder='Tell us more'
                                              onChange={this.handleEditTimesheetDataChange} 
                                              value={this.state.editTimesheet.detail} name="detail"/>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button positive onClick={this.handleTimesheetEdit}>
                                    Ubah
                                </Button>
                                <Button negative onClick={()=>{this.setState({editTimesheetModalOpen:false})}}>
                                    Batal
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                )
            }
            case 'employee' : {
                let employeeList = this.props.employeeList
                let filterEmployee = (employeeList).filter((employee)=>{
                    return (employee.name.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (employee.employeeID.toUpperCase()).match((this.props.search.toString()).toUpperCase())
                })
                let employeeCards = filterEmployee.map((employee, i)=>{
                    return (
                        <div key={employee.employeeID} className="card" onClick={()=>{this.handleEmployeeCardClick(employee.employeeID)}}>
                            <div className="photo">
                            </div>
                            <div className="data">
                                <p>{employee.employeeID}</p>
                                <p>{employee.name}</p>
                            </div>
                        </div>   
                    )
                })
                return(
                    <div className='cards-wrapper'>
                        {employeeCards}
                    </div>
                )
            }
            case 'employee-detailed' : {
                //get selectedEmployee Object
                let employeeList = this.state.employeeList
                let selectedEmployeeID = this.state.selectedEmployee
                if(!selectedEmployeeID){
                    this.props.updateDisplayState('employee')
                    return null
                }
                let selectedEmployee = employeeList.filter((employee)=>{
                    return employee.employeeID === selectedEmployeeID
                })
                selectedEmployee = selectedEmployee[0]

                //get employeeTimesheet and render table
                let EmployeeTimesheet = this.props.employeeTimesheet
                let filterTimesheet = (EmployeeTimesheet).filter((timesheet)=>{
                    return (timesheet.detail.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (timesheet.Project.location.toUpperCase()).match((this.props.search.toString()).toUpperCase()) ||
                           (timesheet.Project.contract.toUpperCase()).match((this.props.search.toString()).toUpperCase())
                })
                let timesheetDetail = filterTimesheet.map((timesheet)=>{
                    return (
                        <tr key={timesheet.id}>
                            <td>{timesheet.Project.contract} - {timesheet.Project.location}</td>
                            <td>{timesheet.date}</td>
                            <td>{timesheet.hours}</td>
                            <td>{timesheet.detail}</td>
                            <td>
                                <a><i className='material-icons' onClick={()=>{this.handleOpenEditEmployeeModal(timesheet.id)}}>edit</i></a>
                                <a><i className='material-icons' onClick={()=>{this.handleTimesheetDelete(timesheet.id)}}>delete</i></a>
                            </td>
                        </tr>
                    )
                })

                //render project selection
                let projectList = this.props.projectList
                let projectRender =[]
                for(let i=0; i<projectList.length; i++){
                    projectRender = [...projectRender,{key:projectList[i].projectID, text:projectList[i].location+'-'+projectList[i].category, value:projectList[i].projectID}]
                }
                console.log(projectRender)
                return(
                    <div className='detail-wrapper'>
                        <Button onClick={()=>{this.props.updateDisplayState('employee')
                                              this.props.updateSearch('')}}>Kembali</Button>
                        <Button onClick={this.handleOpenEmployeeModal}>Tambah</Button>
                        <Modal size='small' open={this.state.newTimesheetModalOpen}>
                            <Modal.Header>Tambah Timesheet</Modal.Header>
                            <Modal.Content scrolling>
                                <div className='form-control-1'>
                                    <label>Proyek</label>
                                    <Dropdown placeholder='Pilih Proyek' name='projectID'
                                              fluid search selection options={projectRender}
                                              value={this.state.newTimesheet.projectID}
                                              onChange={this.handleNewTimesheetDataChange}/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Tanggal</label>
                                    <DateInput
                                        name="date" closable
                                        placeholder="Date" popupPosition="bottom left"
                                        value={this.state.newTimesheet.date}
                                        iconPosition="left" dateFormat="MM-DD-YYYY"
                                        onChange={this.handleNewTimesheetDataChange} />
                                </div>
                                <div className='form-control-1'>
                                    <label>Jumlah Jam</label>
                                    <Input onChange={this.handleNewTimesheetDataChange} 
                                           value={this.state.newTimesheet.hours} name="hours"/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Keterangan</label>
                                    <TextArea rows={4} placeholder='Tell us more'
                                              onChange={this.handleNewTimesheetDataChange} 
                                              value={this.state.newTimesheet.detail} name="detail"/>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button positive onClick={this.handleAddEmployeeTimesheet}>
                                    Tambahkan
                                </Button>
                                <Button negative onClick={()=>{this.setState({newTimesheetModalOpen:false})}}>
                                    Batal
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        {selectedEmployee.employeeID}
                        {selectedEmployee.name}
                        {selectedEmployee.idNumber}
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Proyek</th>
                                    <th>Tanggal</th>
                                    <th>Jumlah Jam</th>
                                    <th>Keterangan</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {timesheetDetail}
                            </tbody>
                        </table>
                        <Modal size='small' open={this.state.editTimesheetModalOpen}>
                            <Modal.Header>Ubah Timesheet</Modal.Header>
                            <Modal.Content scrolling>
                                <div className='form-control-1'>
                                    <label>Proyek</label>
                                    <Dropdown placeholder='Select Country' name='projectID'
                                              fluid search selection options={projectRender}
                                              value={this.state.editTimesheet.projectID}
                                              onChange={this.handleEditTimesheetDataChange}/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Tanggal</label>
                                    <DateInput
                                        name="date" closable
                                        placeholder="Date" popupPosition="bottom left"
                                        value={this.state.editTimesheet.date}
                                        iconPosition="left" dateFormat="MM-DD-YYYY"
                                        onChange={this.handleEditTimesheetDataChange} />
                                </div>
                                <div className='form-control-1'>
                                    <label>Jumlah Jam</label>
                                    <Input onChange={this.handleEditTimesheetDataChange} 
                                           value={this.state.editTimesheet.hours} name="hours"/>
                                </div>
                                <div className='form-control-1'>
                                    <label>Keterangan</label>
                                    <TextArea rows={4} placeholder='Tell us more'
                                              onChange={this.handleEditTimesheetDataChange} 
                                              value={this.state.editTimesheet.detail} name="detail"/>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button positive onClick={this.handleTimesheetEdit}>
                                    Ubah
                                </Button>
                                <Button negative onClick={()=>{this.setState({editTimesheetModalOpen:false})}}>
                                    Batal
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                )
            }
            default : {
                return(
                    <div>default</div>
                )
            }
        }
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        employeeList : (state.mainReducer.employeeList),
        displayState : (state.timesheetReducer.displayState),
        search : (state.timesheetReducer.search),
        employeeTimesheet : state.timesheetReducer.employeeTimesheet,
        projectTimesheet : state.timesheetReducer.projectTimesheet,
        projectList : state.projectReducer.projectList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateDisplayState : (newState) => {
            dispatch({type : 'UPDATE_DISPLAY_STATE', payload : newState})
        },
        updateSearch : (newSearch) => {
            dispatch({type : 'UPDATE_SEARCH', payload : newSearch})
        },
        fetchEmployeeTimesheet : async (eID) => {
            let fetchedTimesheet = await TimesheetService.getTimesheetByEmployee({employeeID : eID})
            dispatch({type : 'FETCH_EMPLOYEE_TIMESHEET', payload : fetchedTimesheet.data})
        },
        fetchProjectTimesheet : async (pID) => {
            let fetchedTimesheet = await TimesheetService.getTimesheetByProject({projectID : pID})
            dispatch({type : 'FETCH_PROJECT_TIMESHEET', payload : fetchedTimesheet.data})
        },
        fetchProjectList : async () => {
            let fetchedList = await ProjectService.getProjects()
            if(fetchedList.status === 200){
                dispatch({type : 'FETCH_PROJECT_LIST', payload : fetchedList.data})
            }
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(TimesheetDisplay);