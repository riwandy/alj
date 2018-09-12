export default function reducer(state = {
    selectedEmployee : {},
    employeeList : []
}, action){
    switch (action.type) {
        case "UPDATE_SELECTED_EMPLOYEE" : {
            return {...state, selectedEmployee:action.payload}
        }
        case "CLEAN_SELECTED_EMPLOYEE" : {
            return {...state, selectedEmployee:action.payload}
        }
        case "FETCH_EMPLOYEE_LIST" : {
            return {...state, employeeList:action.payload}
        }
        default : {
            return state
        }
    }
}