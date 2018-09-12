import ProjectService from '../services/ProjectService'

export default function reducer(state = {
    projectList:[],
    selectedProject:{}
}, action) {
    switch (action.type){
        case "FETCH_PROJECT_LIST" : {
            return {...state, projectList:action.payload}
        }
        case "UPDATE_SELECTED_PROJECT" : {
            return {...state, selectedProject:action.payload}
        }
        case "CLEAN_SELECTED_PROJECT" : {
            return {...state, selectedProject:action.payload}
        }
        default : {
            return state
        }
    }
}