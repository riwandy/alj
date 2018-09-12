export default function reducer(state = {
    vendorList:[],
    selectedVendor:{}
}, action) {
    switch (action.type){
        case "FETCH_VENDOR_LIST" : {
            return {...state, vendorList:action.payload}
        }
        case "UPDATE_SELECTED_VENDOR" : {
            return {...state, selectedVendor:action.payload}
        }
        case "CLEAN_SELECTED_VENDOR" : {
            return {...state, selectedVendor:action.payload}
        }
        default : {
            return state
        }
    }
}