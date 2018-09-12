import api from './Api'

export default {
    signup (credentials) {
        return api().post('/employee/add', credentials)
        .then(function (response) {
            console.log(response)
            return response
        })
        .catch(function (error) {
            console.log(error)
            return error
        })
    },
    login (credentials) {
        return api().post('/login', credentials)
        .then(function (response) {
            console.log(response.data.token)
            return response
        })
    },
    getEmployees () {
        return api().get('/employee/get')
        .then( function (response) {
            console.log('response')
            return response
        })
    },
    getEmployee (eID) {
        console.log(eID)
        return api().post('/employee/get', eID)
        .then(function (response) {
            console.log(response)
            return response
        })
    },
    editStatus (credentials) {
        return api().post('/users/editStatus', credentials)
        .then(function (response) {
            return response
        })
    },
    updateDetail (newDetail){
        return api().post('/employee/update', newDetail)
        .then(function(response) {
            return response
        })
    },
    deleteEmployee (eID) {
        return api().post('/employee/delete', {employeeID : eID})
        .then(function(response){
            console.log('this is the response : ' + response)
            return response
        })
    }
}