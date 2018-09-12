export function updateSelectedEmployee() {
    return {
        type : 'UPDATE_SELECTED_EMPLOYEE',
        payload : 'EMP00002'
    }

}
export function fetchEmployeeList() {
    return {
        type : 'FETCH_EMPLOYEE_LIST',
    }
}