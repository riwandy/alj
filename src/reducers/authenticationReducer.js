export default function reducer(state = {
    currentUser : {},
    isAuthenticated : false
}, action){
    switch (action.type) {
        case "SET_AUTHENTICATED" : {
            return {...state, isAuthenticated:true}
        }
        case "USER_LOGOUT" : {
            return Object.assign({},state,{isAuthenticated:false},{currentUser:{Employee:{}}})
        }
        case "UPDATE_CURRENT_USER" : {
            return {...state, currentUser:action.payload}
        }
        default : {
            return state
        }
    }
}