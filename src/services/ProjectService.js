import api from './Api'

export default {
    getProjects(){
        return api().get('/project/get')
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    getProject(pID){
        return api().post('/project/get',pID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    editProject(newProject){
        return api().post('/project/edit',newProject)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    addProject(newProject){
        return api().post('/project/add',newProject)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    deleteProject(pID){
        return api().post('/project/delete',pID)
        .then(function(response){
            return response
        })
        .catch(function(err){
            return err.response
        })
    }
}