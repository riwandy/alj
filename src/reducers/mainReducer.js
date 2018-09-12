import EmployeeService from '../services/EmployeeService'

export default function reducer(state = {
    employeeList:[]
}, action) {
    switch (action.type){
        case "FETCH_EMPLOYEE_LIST" : {
            return {...state, employeeList:action.payload}
        }
        default : {
            return state
        }
    }
}