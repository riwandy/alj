export default function reducer(state = {
    employeeList:[],
    displayState:'employee',
    search:'',
    employeeTimesheet:[],
    projectTimesheet:[]
}, action) {
    switch (action.type){
        case "FETCH_EMPLOYEE_LIST" : {
            return {...state, employeeList:action.payload}
        }
        case "UPDATE_DISPLAY_STATE" : {
            return {...state, displayState:action.payload}
        }
        case "UPDATE_SEARCH" : {
            return {...state, search:action.payload}
        }
        case "FETCH_EMPLOYEE_TIMESHEET" : {
            return {...state, employeeTimesheet:action.payload}
        }
        case "FETCH_PROJECT_TIMESHEET" : {
            return {...state, projectTimesheet:action.payload}
        }
        default : {
            return state
        }
    }
}