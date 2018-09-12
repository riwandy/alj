export default function reducer(state = {
    userList : [],
    selectedUser : {}
}, action){
    switch (action.type) {
        case "FETCH_USER_LIST" : {
            return {...state, userList:action.payload}
        }
        case "UPDATE_SELECTED_USER" : {
            return {...state, selectedUser:action.payload}
        }
        case "CLEAN_SELECTED_USER" : {
            return {...state, selectedUser:action.payload}
        }
        default : {
            return state
        }
    }
}