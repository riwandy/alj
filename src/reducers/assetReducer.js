export default function reducer(state = {
    assetList:[],
    selectedAsset:{}
}, action) {
    switch (action.type){
        case "FETCH_ASSET_LIST" : {
            return {...state, assetList:action.payload}
        }
        case "UPDATE_SELECTED_ASSET" : {
            return {...state, selectedAsset:action.payload}
        }
        case "CLEAN_SELECTED_ASSET" : {
            return {...state, selectedAsset:action.payload}
        }
        default : {
            return state
        }
    }
}