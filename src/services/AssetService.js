import api from './Api'

export default {
    getAssets(){
        return api().get('/asset/get')
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    getAsset(vID){
        return api().post('/asset/get',vID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    editAsset(newAsset){
        return api().post('/asset/edit',newAsset)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    addAsset(newAsset){
        return api().post('/asset/add',newAsset)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    deleteAsset(vID){
        return api().post('/asset/delete',vID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    }
}