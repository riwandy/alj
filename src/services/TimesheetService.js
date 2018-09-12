import api from'./Api'

export default {
    getTimesheet (id) {
        return api().post('/timesheet/get',id)
        .then(function(response) {
            return response
        })
    },
    getTimesheetByEmployee (employeeID) {
        return api().post('/timesheet/get/employee',employeeID)
        .then(function(response) {
            return response
        })
    },
    getTimesheetByProject (projectID) {
        return api().post('/timesheet/get/project',projectID)
        .then(function(response) {
            return response
        })
    },
    deleteTimesheet (id) {
        return api().post('/timesheet/delete',id)
        .then(function(response) {
            return response
        })
    },
    addTimesheet (newTimesheet) {
        return api().post('/timesheet/add',newTimesheet)
        .then(function(response) {
            return response
        })
        .catch(function(err){
            return err.response
        })
    },
    editTimesheet (newTimesheet) {
        return api().post('/timesheet/edit',newTimesheet)
        .then(function(response) {
            return response
        })
    }
}