import { combineReducers } from 'redux'

//import all reducers
import employeeReducer from './employeeReducer'
import timesheetReducer from './timesheetReducer'
import mainReducer from './mainReducer'
import projectReducer from './projectReducer'
import authenticationReducer from './authenticationReducer'
import userReducer from './userReducer'
import clientReducer from './clientReducer'
import vendorReducer from './vendorReducer'
import vehicleReducer from './vehicleReducer'
import assetReducer from './assetReducer'

let appReducer = combineReducers({
    employeeReducer,
    timesheetReducer,
    mainReducer,
    projectReducer,
    authenticationReducer,
    userReducer,
    clientReducer,
    vendorReducer,
    assetReducer,
    vehicleReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer