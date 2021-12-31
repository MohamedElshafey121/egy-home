import {
    GET_ALL_ROLES_REQUEST,
    GET_ALL_ROLES_SUCCESS,
    GET_ALL_ROLES_FAIL,
    GET_ONE_ROLE_REQUEST,
    GET_ONE_ROLE_SUCCESS,
    GET_ONE_ROLE_FAIL,
    ADD_PERMISSION_TO_ROLE_REQUEST,
    ADD_PERMISSION_TO_ROLE_SUCCESS,
    ADD_PERMISSION_TO_ROLE_FAIL,
    ADD_PERMISSION_TO_ROLE_RESET,
    CREATE_NEW_ROLE_REQUEST,
    CREATE_NEW_ROLE_SUCCESS,
    CREATE_NEW_ROLE_FAIL,
    CREATE_NEW_ROLE_RESET,
    REMOVE_PERMISSION_FROM_ROLE_REQUEST,
    REMOVE_PERMISSION_FROM_ROLE_SUCCESS,
    REMOVE_PERMISSION_FROM_ROLE_FAIL,
    REMOVE_PERMISSION_FROM_ROLE_RESET,
    UPDATE_ROLE_DESCRIPTION_REQUEST,
    UPDATE_ROLE_DESCRIPTION_SUCCESS,
    UPDATE_ROLE_DESCRIPTION_FAIL,
} from "./rolesActionTypes";

function allRolesReducer(state = { roles: null }, action) {
    switch (action.type) {
        case GET_ALL_ROLES_REQUEST:
            return { loading: true };
        case GET_ALL_ROLES_SUCCESS:
            return { loading: false, roles: action.payload, page: action.page, count: action.count };
        case GET_ALL_ROLES_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function getOneRoleReducer(state = { role: null }, action) {
    switch (action.type) {
        case GET_ONE_ROLE_REQUEST:
            return { loading: true };
        case GET_ONE_ROLE_SUCCESS:
            return { loading: false, role: action.payload };
        case GET_ONE_ROLE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function removePermissionFromRoleReducer(state = {}, action) {
    switch (action.type) {
        case REMOVE_PERMISSION_FROM_ROLE_REQUEST:
            return { loading: true };
        case REMOVE_PERMISSION_FROM_ROLE_SUCCESS:
            return { loading: false, success: true };
        case REMOVE_PERMISSION_FROM_ROLE_FAIL:
            return { loading: false, error: action.payload };
        case REMOVE_PERMISSION_FROM_ROLE_RESET:
            return {};
        default:
            return state;
    }
}

function addPermissionToRoleReducer(state = {}, action) {
    switch (action.type) {
        case ADD_PERMISSION_TO_ROLE_REQUEST:
            return { loading: true };
        case ADD_PERMISSION_TO_ROLE_SUCCESS:
            return { loading: false, success: true };
        case ADD_PERMISSION_TO_ROLE_FAIL:
            return { loading: false, error: action.payload };
        case ADD_PERMISSION_TO_ROLE_RESET:
            return {};
        default:
            return state;
    }
}

function updateRoleDescriptionReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_ROLE_DESCRIPTION_REQUEST:
            return { loading: true };
        case UPDATE_ROLE_DESCRIPTION_SUCCESS:
            return { loading: false, success: true };
        case UPDATE_ROLE_DESCRIPTION_FAIL:
            return {};
        default:
            return state;
    }
}

function createRoleReducer(state = {}, action) {
    switch (action.type) {
        case CREATE_NEW_ROLE_REQUEST:
            return { loading: true };
        case CREATE_NEW_ROLE_SUCCESS:
            return { loading: false, success: true };
        case CREATE_NEW_ROLE_FAIL:
            return { loading: false, error: action.payload };
        case CREATE_NEW_ROLE_RESET:
            return {};
        default:
            return state;
    }
}

export {
    allRolesReducer,
    getOneRoleReducer,
    addPermissionToRoleReducer,
    createRoleReducer,
    removePermissionFromRoleReducer,
    updateRoleDescriptionReducer,
};
