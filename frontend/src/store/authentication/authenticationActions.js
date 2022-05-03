import axios from "axios";
import { toast } from "react-toastify";

import {
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    SOCIAL_LOGIN_REQUEST,
    SOCIAL_LOGIN_SUCCESS,
    SOCIAL_LOGIN_FAILED,
    SOCIAL_LOGIN_RESET,
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

function getData(result) {
    return result.data.data.user;
}

function getError(error) {
    return error.response.data.message;
}

//handle register redux action creator
export const handleRegister =
    ({ name, email, password, passwordConfirm }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: SIGN_UP_REQUEST,
            });

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axios.post(
                "/users/signUp",
                {
                    name,
                    email,
                    password,
                    passwordConfirm,
                },
                config
            );

            const user = getData(response);
            user.token = response.data.token;

            dispatch({
                type: SIGN_UP_SUCCESS,
                payload: user,
            });

            dispatch({
                type: LOGIN_SUCCESS,
                payload: user,
            });

            localStorage.setItem("userInfo", JSON.stringify(user));
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: SIGN_UP_FAIL,
                payload: message,
            });
        }
    };

//handle login redux action creator
export const handleLogin =
    ({ email, password }) =>
    async (dispatch) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            dispatch({
                type: LOGIN_REQUEST,
            });

            const result = await axios.post(
                "/users/login",
                {
                    email,
                    password,
                },
                config
            );

            const user = getData(result);

            user.token = result.data.token;
            dispatch({
                type: LOGIN_SUCCESS,
                payload: user,
            });
            localStorage.setItem("userInfo", JSON.stringify(user));
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: LOGIN_FAILED,
                payload: message,
            });
        }
    };

//handle Social login redux action creator
export const handleSocialLogin = (token) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        dispatch({
            type: SOCIAL_LOGIN_REQUEST,
        });

        const result = await axios.post(`/auth/login/success/${token}`, config);

        const user = getData(result);

        user.token = result.data.token;
        dispatch({
            type: SOCIAL_LOGIN_SUCCESS,
            payload: user,
        });
        localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;

        dispatch({
            type: SOCIAL_LOGIN_FAILED,
            payload: message,
        });
    }
};

export const socialLoginReset = () => {
    return { type: SOCIAL_LOGIN_RESET };
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    // document.location.href = "/auth/login";
};

export function forgetPassword(email) {
    return async (dispatch) => {
        try {
            dispatch({ type: FORGET_PASSWORD_REQUEST });

            await axios.post(`/users/forgotPassword`, { email });

            dispatch({
                type: FORGET_PASSWORD_SUCCESS,
            });
            toast.success(`Email sent to ${email} please,check your inbox to get reset password link !`, {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: FORGET_PASSWORD_FAIL,
                payload: message,
            });
            toast.error(`Error sending Reset password Link, please try again`, {
                theme: "colored",
            });
        }
    };
}

export function forgetPasswordReset() {
    return { type: FORGET_PASSWORD_RESET };
}

export function resetPasswordReset() {
    return { type: RESET_PASSWORD_RESET };
}

export function resetPassword(resetToken, newData) {
    return async (dispatch) => {
        try {
            dispatch({ type: RESET_PASSWORD_REQUEST });

            const { data } = await axios.post(`/users/resetPassword/${resetToken}`, newData);
            // console.log( 'data',data.data.data );
            const user = data.data.user;
            user.token = data.token;

            dispatch({
                type: RESET_PASSWORD_SUCCESS,
            });

            dispatch({
                type: LOGIN_SUCCESS,
                payload: user,
            });

            localStorage.setItem("userInfo", JSON.stringify(user));

            toast.success(`Your password has changed successfully`, {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: RESET_PASSWORD_FAIL,
                payload: message,
            });

            toast.error(`error reseting password!`, {
                theme: "colored",
            });
        }
    };
}

export function setConfirmationEmail(email = "", message = "", shortMessage = "") {
    return {
        type: CONFIRMATION_EMAIL_SET,
        message,
        shortMessage,
        email,
    };
}

export function resetConfirmationEmail() {
    return { type: CONFIRMATION_EMAIL_RESET };
}
