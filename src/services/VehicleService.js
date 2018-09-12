import api from './Api'

export default {
    getVehicles(){
        return api().get('/vehicle/get')
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    getVehicle(vID){
        return api().post('/vehicle/get',vID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    editVehicle(newVehicle){
        return api().post('/vehicle/edit',newVehicle)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    addVehicle(newVehicle){
        return api().post('/vehicle/add',newVehicle)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    deleteVehicle(vID){
        return api().post('/vehicle/delete',vID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    }
}