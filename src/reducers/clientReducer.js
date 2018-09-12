export default function reducer(state = {
    clientList : [],
    selectedClient : {}
}, action){
    switch (action.type) {
        case "FETCH_CLIENT_LIST" : {
            return {...state, clientList:action.payload}
        }
        case "UPDATE_SELECTED_CLIENT" : {
            return {...state, selectedClient:action.payload}
        }
        case "CLEAN_SELECTED_CLIENT" : {
            return {...state, selectedClient:action.payload}
        }
        default : {
            return state
        }
    }
}