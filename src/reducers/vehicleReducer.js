export default function reducer(state = {
    vehicleList:[],
    selectedVehicle:{}
}, action) {
    switch (action.type){
        case "FETCH_VEHICLE_LIST" : {
            return {...state, vehicleList:action.payload}
        }
        case "UPDATE_SELECTED_VEHICLE" : {
            return {...state, selectedVehicle:action.payload}
        }
        case "CLEAN_SELECTED_VEHICLE" : {
            return {...state, selectedVehicle:action.payload}
        }
        default : {
            return state
        }
    }
}