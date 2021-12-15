import {
    GET_ALL_PERMISSIONS_REQUEST,
    GET_ALL_PERMISSIONS_SUCCESS,
    GET_ALL_PERMISSIONS_FAIL,
} from "./permissionsActionsTypes";

function getAllPermissionsReducer(state = { permissions: null }, action) {
    switch (action.type) {
        case GET_ALL_PERMISSIONS_REQUEST:
            return { loading: true };
        case GET_ALL_PERMISSIONS_SUCCESS:
            return { loading: false, permissions: action.payload };
        case GET_ALL_PERMISSIONS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export { getAllPermissionsReducer };
