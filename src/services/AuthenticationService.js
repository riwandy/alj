import api from './Api'
import setAuthorizationToken from '../utils/setAuthorizationToken'

export default {
    addUser (credentials) {
        return api().post('/user/add', credentials)
        .then(function (response) {
            console.log(response)
            return response
        })
        .catch(function (error) {
            console.log(error.response)
            return error.response
        })
    },
    login (credentials) {
        return api().post('/user/login', credentials)
        .then(function (response) {
            localStorage.setItem('Authorization',response.data.token)
            setAuthorizationToken(response.data.token)
            console.log('authenticationservice')
            console.log(response)
            return response
        })
        .catch(function(err){
            console.log(err.response)
            return err.response
        })
    },
    getUsers () {
        return api().get('/user/get')
        .then(function (response) {
            console.log(response)
            return response
        })
    },
    getUser (id) {
        return api().post('/user/get', id)
        .then(function (response) {
            console.log(response)
            return response
        })
    },
    deleteUser (id) {
        return api().post('/user/delete', id)
        .then(function (response) {
            console.log(response)
            return response
        })
        .catch(function(err){
            console.log(err.response)
        })
    },
    editUser (credentials) {
        return api().post('/user/update', credentials)
        .then(function (response) {
            return response
        })
        .catch(function(err){
            return err.response
        })
    }
}