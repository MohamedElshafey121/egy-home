import {
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    FORGET_PASSWORD_REQUEST,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAIL,
    FORGET_PASSWORD_RESET,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_RESET,
    CONFIRMATION_EMAIL_SET,
    CONFIRMATION_EMAIL_RESET,
    USER_LOGOUT,
} from "./authenticationActionTypes";

export function userRegisterReducer(state = {}, action) {
    switch (action.type) {
        case SIGN_UP_REQUEST:
            return { loading: true };

        case SIGN_UP_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case SIGN_UP_FAIL:
            return { loading: false, error: action.payload };

        case USER_LOGOUT:
            return {};

        default:
            return state;
    }
}

export function userLoginReducer(state = {}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { loading: true };

        case LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };

        case LOGIN_FAILED:
            return { loading: false, error: action.payload };

        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}

export function forgetPasswordReducer(state = {}, action) {
    switch (action.type) {
        case FORGET_PASSWORD_REQUEST:
            return { loading: true };
        case FORGET_PASSWORD_SUCCESS:
            return { loading: false, success: true };
        case FORGET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case FORGET_PASSWORD_RESET:
            return {};
        default:
            return state;
    }
}

export function confirmationMessageReducer(state = {}, action) {
    switch (action.type) {
        case CONFIRMATION_EMAIL_SET:
            return { success: true, message: action.message, shortMessage: action.shortMessage, email: action.email };
        case CONFIRMATION_EMAIL_RESET:
            return {};
        default:
            return state;
    }
}

export function resetPasswordReducer(state = {}, action) {
    switch (action.type) {
        case RESET_PASSWORD_REQUEST:
            return { loading: true };
        case RESET_PASSWORD_SUCCESS:
            return { loading: false, success: true };
        case RESET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case RESET_PASSWORD_RESET:
            return {};
        default:
            return state;
    }
}
