import api from './Api'

export default {
    getVendors(){
        return api().get('/vendor/get')
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    getVendor(vID){
        return api().post('/vendor/get',vID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    editVendor(newVendor){
        return api().post('/vendor/edit',newVendor)
        .then(function(response){
            return response
        })
        .catch(function(err){
            console.log(err.response)
            return err.response
        })
    },
    addVendor(newVendor){
        return api().post('/vendor/add',newVendor)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    deleteVendor(vID){
        return api().post('/vendor/delete',vID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    }
}