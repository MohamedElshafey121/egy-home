import {
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_RESET,
    ADD_USER_ADDRESS_REQUEST,
    ADD_USER_ADDRESS_SUCCESS,
    ADD_USER_ADDRESS_FAIL,
    ADD_USER_ADDRESS_RESET,
    USER_ADDRESS_DETAILS_REQUEST,
    USER_ADDRESS_DETAILS_SUCCESS,
    USER_ADDRESS_DETAILS_FAIL,
    USER_ADDRESS_DETAILS_RESET,
    UPDATE_USER_ADDRESS_REQUEST,
    UPDATE_USER_ADDRESS_SUCCESS,
    UPDATE_USER_ADDRESS_FAIL,
    UPDATE_USER_ADDRESS_RESET,
    DELETE_USER_ADDRESS_REQUEST,
    DELETE_USER_ADDRESS_SUCCESS,
    DELETE_USER_ADDRESS_FAIL,
    DELETE_USER_ADDRESS_RESET,
    GET_ALL_USERS_REQUEST,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAIL,
    CHANGE_USER_ROLE_REQUEST,
    CHANGE_USER_ROLE_SUCCESS,
    CHANGE_USER_ROLE_FAIL,
    CHANGE_USER_ROLE_RESET,
    CHANGE_USER_CATEGORY_REQUEST,
    CHANGE_USER_CATEGORY_SUCCESS,
    CHANGE_USER_CATEGORY_FAIL,
    CHANGE_USER_CATEGORY_RESET,
} from "./userActionsTypes";

export function userDetailsReducer(state = { user: {} }, action) {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { ...state, loading: true };

        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload };

        case USER_DETAILS_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
}

export function userUpdateProfileReducer(state = {}, action) {
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return { loading: true };
        case USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, success: true };
        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_PROFILE_RESET:
            return {};
        default:
            return state;
    }
}

export function userAddressReducer(state = {}, action) {
    switch (action.type) {
        case ADD_USER_ADDRESS_REQUEST:
            return { loading: true };
        case ADD_USER_ADDRESS_SUCCESS:
            return { loading: false, success: true };
        case ADD_USER_ADDRESS_FAIL:
            return { loading: false, error: action.payload };
        case ADD_USER_ADDRESS_RESET:
            return {};
        default:
            return state;
    }
}

export function userAddressDetailsReducer(state = { address: {} }, action) {
    switch (action.type) {
        case USER_ADDRESS_DETAILS_REQUEST:
            return { loading: true };
        case USER_ADDRESS_DETAILS_SUCCESS:
            return { loading: false, address: action.payload };
        case USER_ADDRESS_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case USER_ADDRESS_DETAILS_RESET:
            return { address: {} };
        default:
            return state;
    }
}

export function updateAddressReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_USER_ADDRESS_REQUEST:
            return { loading: true };
        case UPDATE_USER_ADDRESS_SUCCESS:
            return { loading: false, success: true };
        case UPDATE_USER_ADDRESS_FAIL:
            return { loading: false, error: action.payload };
        case UPDATE_USER_ADDRESS_RESET:
            return {};
        default:
            return state;
    }
}

export function deleteAddressReducer(state = { user: { address: [] } }, action) {
    switch (action.type) {
        case DELETE_USER_ADDRESS_REQUEST:
            return { loading: true };
        case DELETE_USER_ADDRESS_SUCCESS:
            return { loading: false, user: action.payload, success: true };
        case DELETE_USER_ADDRESS_FAIL:
            return { loading: false, error: action.payload };
        case DELETE_USER_ADDRESS_RESET:
            return { user: { address: [] } };
        default:
            return state;
    }
}

export function getAllUsersReducer(state = { users: null }, action) {
    switch (action.type) {
        case GET_ALL_USERS_REQUEST:
            return { loading: true };
        case GET_ALL_USERS_SUCCESS:
            return { loading: false, users: action.payload, page: action.page, count: action.count };
        case GET_ALL_USERS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function cahngeUserRoleReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_USER_ROLE_REQUEST:
            return { loading: true };
        case CHANGE_USER_ROLE_SUCCESS:
            return { loading: false, success: true };
        case CHANGE_USER_ROLE_FAIL:
            return { loading: false, error: action.payload };
        case CHANGE_USER_ROLE_RESET:
            return {};
        default:
            return state;
    }
}

export function cahngeUserCategoriesReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_USER_CATEGORY_REQUEST:
            return { loading: true };
        case CHANGE_USER_CATEGORY_SUCCESS:
            return { loading: false, success: true };
        case CHANGE_USER_CATEGORY_FAIL:
            return { loading: false, error: action.payload };
        case CHANGE_USER_CATEGORY_RESET:
            return {};
        default:
            return state;
    }
}
