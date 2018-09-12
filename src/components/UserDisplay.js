import React, { Component } from 'react';
import { connect, connectAdvanced } from 'react-redux';
import AuthenticationService from '../services/AuthenticationService'
import { Input,Header,Button,Select } from 'semantic-ui-react'
import swal from 'sweetalert';
import iziToast from 'izitoast';
import equal from 'deep-equal';
import styles from './css/UserDisplay.css';

class UserDisplay extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            selectedUser : {},
            prevSelectedUser : {},
            newUser : {username:'',password:'',employeeID:''}
        }
    }

    //eventhandler function
    handleSelectedUserChange (e,{name,value}) {
        let newState = Object.assign({},this.state.selectedUser)
        newState[name] = value;
        console.log(value)
        this.setState({selectedUser : newState})
    }

    handleApproval = async (newValue) => {
        console.log('approved')
        try{
            let newData = Object.assign({},this.state.selectedUser, {approved : newValue})
            console.log(newData)
            await AuthenticationService.editUser(newData)
            await this.props.fetchUserList()
            await this.props.editSelectedUser(this.state.selectedUser.id)
            await this.setState({editMode : false})
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Perubahan anda telah berhasil disimpan'
                });
        }catch(err){
            
        }
    }
    
    handleNewUserChange(e,{value,name}) {
        let newState = Object.assign({},this.state.newUser)
        newState[name] = value;
        this.setState({newUser : newState})
    }

    handleAddUser = async () => {
        let result = await AuthenticationService.addUser(this.state.newUser)
        if(result.status == 200){
            await this.props.fetchUserList()
            await this.setState({newUser : {}})
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Akun baru telah berhasil didaftarkan'
                });
        }else{
            console.log(result)
            iziToast.error({
                    title: 'Gagal',
                    position: 'bottomRight',
                    message: result.data.error
                });
        }
    }

    handleClearNewUser = () => {
        this.setState({newUser:{username:'',password:'',employeeID:''}})    
    }

    handleEditModeClick = () => {
        this.setState({editMode : true})
    }

    handleEditUserSubmit = async () => {
        let result = await AuthenticationService.editUser(this.state.selectedUser)
        if(result.status == 200){
            await this.props.fetchUserList()
            await this.props.editSelectedUser(this.state.selectedUser.id)
            await this.setState({editMode : false})
            iziToast.success({
                    title: 'Sukses',
                    position: 'bottomRight',
                    message: 'Perubahan anda telah berhasil disimpan'
                });
        }else {
            console.log(result)
            iziToast.error({
                    title: 'Gagal',
                    position: 'bottomRight',
                    message: result.data.error
                });
        }
    }

    handleDeleteUserClick = async () => {
        let confirmed = await swal(`Apakah anda yakin akan menghapus ${this.state.selectedUser.username} dari daftar pengguna ?`, 
                                    {buttons: ["Batal", "Lanjut"], i: 'warning'}
                                );
        if(confirmed){
            let response = await AuthenticationService.deleteUser({username : this.state.selectedUser.username})
            if(response.status == 200){
                iziToast.success({
                    title: this.state.selectedUser.username,
                    position: 'bottomRight',
                        message: `telah berhasil dihapus dari daftar pengguna`
                });
            }else{
                iziToast.error({
                    title: this.state.selectedUser.username,
                    position: 'bottomRight',
                        message: `telah berhasil dihapus dari daftar pengguna`
                });
            }
            await this.props.fetchUserList()
            await this.props.clearSelectedUser()
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(!equal(props.selectedUser,state.prevSelectedUser)){
            return {
                selectedUser : Object.assign({}, props.selectedUser),
                prevSelectedUser : Object.assign({}, props.selectedUser),
                newUser : {username:'', employeeID:'', password:''},
                editMode : false
            }
        }else{
            return null
        }
    }

    render() {
        //render dynamic options for employeeID
        let employeeList = this.props.employeeList
        let employeeIDs = []
        for(let i=0; i<employeeList.length; i++){
            employeeIDs = [...employeeIDs, {key:employeeList[i].employeeID, value:employeeList[i].employeeID, text:employeeList[i].employeeID}]
        }

        if(equal(this.props.selectedUser,{})){
            return (
                <div className="display">
                    <div className="display-data">
                        <a id="employeeID">{this.state.selectedUser.employeeID}</a>
                        <div id="newUserDetail">
                            <span id="title">
                                <i className="material-icons">people</i>
                                <span>Akun Baru</span>
                            </span>
                            <div id="username" className="form-control-1">
                                <label htmlFor="username">Username</label>
                                <Input onChange={this.handleNewUserChange.bind(this)}
                                        name="username" value={this.state.newUser.username}/>
                            </div>
                            <div id="employeeId" className="form-control-1">
                                <label htmlFor="employeeID">ID Karyawan</label>
                                <Select onChange={this.handleNewUserChange.bind(this)} options={employeeIDs}
                                        name="employeeID" value={this.state.newUser.employeeID}/>
                            </div>
                            <div id="password" className="form-control-1">
                                <label htmlFor="password">Password</label>
                                <Input onChange={this.handleNewUserChange.bind(this)} type="password"
                                        name="password" value={this.state.newUser.password}/>
                            </div>
                            <Button icon="add" onClick={this.handleAddUser}/>
                            <Button icon="cancel" onClick={this.handleClearNewUser}/>
                        </div>
                    </div>
                </div>
            )
        } else{
            //render dynamic phone
            let phoneList = this.state.selectedUser.Employee.hp
            var phones = phoneList.map(function(phone, index){
                return  <div id="hp" className="form-control-1" key={index}>
                            <label for={'HP'+(index+1)}>{'HP'+(index+1)}</label>
                            <Input name={'HP'+(index+1)} readOnly value={phone}/>
                        </div>
            })

            // render dynamic approved button
            let approvedField = ""
            if(this.state.selectedUser.access_level < this.props.currentUser.access_level){
                if(this.state.selectedUser.approved){
                    approvedField = <Input action={<Button color= 'red' labelPosition= 'left' icon= 'delete' content= 'BATALKAN' onClick={()=>{this.handleApproval('false')}}/>}
                                            name="approved"
                                            value={this.state.selectedUser.approved ? 'AKSES TELAH DIBERIKAN' : 'AKSES BELUM DIBERIKAN'}
                                        />
                } else {
                    approvedField = <Input action={<Button color= 'teal' labelPosition= 'left' icon= 'check' content= 'SETUJUI' onClick={()=>{this.handleApproval('true')}}/>}
                                            value={this.state.selectedUser.approved ? 'AKSES TELAH DIBERIKAN' : 'AKSES BELUM DIBERIKAN'}
                                        />
                }
            }else {
                if(this.state.selectedUser.approved){
                    approvedField = <Input  name="approved"
                                            value={this.state.selectedUser.approved ? 'AKSES TELAH DIBERIKAN' : 'AKSES BELUM DIBERIKAN'}
                                        />
                } else {
                    approvedField = <Input value={this.state.selectedUser.approved ? 'AKSES TELAH DIBERIKAN' : 'AKSES BELUM DIBERIKAN'}
                                        />
                }
            }

            //render dynamic options for access level
            let possibleLevels = []
            let maxLevel = this.props.currentUser.access_level
            if(this.props.currentUser.id == this.state.selectedUser.id){
                maxLevel += 1
            }
            for(let i=1; i<maxLevel; i++){
                possibleLevels = [...possibleLevels, {key:i, text:i, value:i}]
            }

            //render password field
            let password = ''
            if(this.props.currentUser.access_level==5){
                password = <div id="password" className="form-control-1">
                                <label>Password</label>
                                <Input onChange={this.handleSelectedUserChange.bind(this)} readOnly={!this.state.editMode}
                                    name="password" value={this.state.selectedUser.password}/>
                            </div>
            }

            return (
                <div className="display">
                    <div className="display-data">
                        <div id="userDetail">
                            <span id="title">
                                <i className="material-icons">people</i>
                                <span>Informasi Akun</span>
                            </span>
                            <div id="styles.employeeID" className="form-control-1">
                                <label htmlFor="username">Username</label>
                                <Input onChange={this.handleSelectedUserChange.bind(this)} readOnly={!this.state.editMode}
                                       name="username" value={this.state.selectedUser.username}/>
                            </div>
                            <div id="name" className="form-control-1">
                                <label for="name">Approved</label>
                                {approvedField}
                            </div>
                            <div id="styles.employeeID" className="form-control-1">
                                <label for="name">Level Akses</label>
                                <Select name="access_level" placeholder='Level Akses' options={possibleLevels} disabled={!this.state.editMode}
                                        value={this.state.selectedUser.access_level} onChange={this.handleSelectedUserChange.bind(this)}/>
                            </div>
                            {password}
                        </div>
                        <div id="employeeDetail">
                            <span id="title">
                                <i className="material-icons">people</i>
                                <span>Data Pengguna</span>
                            </span>
                            <div id="styles.employeeID" className="form-control-1">
                                <label for="name">ID Karyawan</label>
                                <Select name="employeeID" disabled={!this.state.editMode} search
                                        value={this.state.selectedUser.employeeID} options={employeeIDs}
                                        onChange={this.handleSelectedUserChange.bind(this)}/>
                            </div>
                            <div id="name" className="form-control-1">
                                <label for="name">Nama</label>
                                <Input name="name" readOnly
                                        value={this.state.selectedUser.Employee.name}/>
                            </div>
                            <div id="styles.employeeID" className="form-control-1">
                                <label for="name">Whatsapp</label>
                                <Input name="employeeID" readOnly
                                        value={this.state.selectedUser.Employee.whatsapp}/>
                            </div>
                            <div id="styles.employeeID" className="form-control-1">
                                <label for="name">Jabatan</label>
                                <Input name="employeeID" readOnly
                                        value={this.state.selectedUser.Employee.position}/>
                            </div>
                            {phones}
                        </div>
                    </div>
                    <div id="controls">
                            <Button circular onClick={this.handleEditModeClick}
                                    disabled={this.state.editMode} icon='edit'
                                    className="button is-primary" color='green' />
                            <Button circular onClick={this.handleEditUserSubmit} icon='save'
                                    disabled={equal(this.props.selectedUser, this.state.selectedUser) ? true : false}
                                    color="blue" /> 
                            <Button circular onClick={this.handleDeleteUserClick} icon='delete' color='red' />
                    </div>
                </div>
            )

        }
    }
}

const mapStateToProps = (state) => {
    return {
        selectedUser : Object.assign({},state.userReducer.selectedUser),
        currentUser : Object.assign({},state.authenticationReducer.currentUser),
        employeeList : [...state.employeeReducer.employeeList]
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSelectedUser : async (id) => {
            let fetchedData = await AuthenticationService.getUser({id : id})
            console.log(fetchedData)
            if(fetchedData.status === 200){
                await dispatch({type : "UPDATE_SELECTED_USER", payload : fetchedData.data})
            }
        },
        clearSelectedUser : async () => {
            await dispatch({type : "UPDATE_SELECTED_USER", payload : {}})
        },
        fetchUserList : async () => {
            let fetchedList = await AuthenticationService.getUsers();
            if(fetchedList.status === 200){
                await dispatch({type : 'FETCH_USER_LIST', payload : fetchedList.data});
            }
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(UserDisplay);