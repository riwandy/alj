import api from './Api'

export default {
    addClient (credentials) {
        return api().post('/client/add', credentials)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    getClients () {
        return api().get('/client/get')
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    getClient (cID) {
        return api().post('/client/get', cID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    editClient (newDetail){
        return api().post('/client/edit', newDetail)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    deleteClient (cID) {
        return api().post('/client/delete', cID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    }
}