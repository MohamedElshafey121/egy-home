import axios from "axios";
import { toast } from "react-toastify";
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

function getUserDetails(id) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: USER_DETAILS_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/users/${id}`, config);
            // console.log( 'data',data.data.data );

            dispatch({
                type: USER_DETAILS_SUCCESS,
                payload: data.data.data,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: USER_DETAILS_FAIL,
                payload: message,
            });
        }
    };
}

function updateUserProfile(user) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch("/users/profile", user, config);
            const userData = data.data.user;
            const token = data.token;

            dispatch({
                type: USER_UPDATE_PROFILE_SUCCESS,
            });

            toast.success(`User Name Changed successfully`, { theme: "colored" });

            dispatch({
                type: USER_DETAILS_SUCCESS,
                payload: userData,
            });
            // console.log(...userData);

            //update userInfo in LocalStorage
            const oldData = JSON.parse(localStorage.getItem("userInfo"));
            localStorage.setItem("userInfo", JSON.stringify({ ...oldData, ...userData }));
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            toast.error(`Error Updating User Data, try again later`, { theme: "colored" });

            dispatch({
                type: USER_UPDATE_PROFILE_FAIL,
                payload: message,
            });
        }
    };
}

function addNewUserAddress(address) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: ADD_USER_ADDRESS_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.patch("/users/address", address, config);
            dispatch({ type: ADD_USER_ADDRESS_SUCCESS });
            toast.success(`User Address Added successfully`, { theme: "colored" });
        } catch (error) {
            console.log(error.response);
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            toast.error(`Error creating Address Try again`, { theme: "colored" });

            dispatch({
                type: ADD_USER_ADDRESS_FAIL,
                payload: message,
            });
        }
    };
}

function getAddressDetails(addressId) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: USER_ADDRESS_DETAILS_REQUEST });
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/users/address/${addressId}`, config);
            // console.log(data.data.address)
            const address = data.data.address;

            dispatch({
                type: USER_ADDRESS_DETAILS_SUCCESS,
                payload: address,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: USER_ADDRESS_DETAILS_FAIL,
                payload: message,
            });
        }
    };
}

function updateUserAddress(addressId, data) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: UPDATE_USER_ADDRESS_REQUEST });
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.patch(`/users/address/${addressId}`, data, config);
            dispatch({ type: UPDATE_USER_ADDRESS_SUCCESS });
            toast.success(`User Address Updated successfully`, { theme: "colored" });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            toast.error(`Error updating Address Try again`, { theme: "colored" });

            dispatch({
                type: UPDATE_USER_ADDRESS_FAIL,
                payload: message,
            });
        }
    };
}

function deleteUserAddress(addressId) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: DELETE_USER_ADDRESS_REQUEST });
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.delete(`/users/address/${addressId}`, config);
            console.log("data.data.user: ", data.data.user);
            dispatch({
                type: DELETE_USER_ADDRESS_SUCCESS,
                payload: data.data.user,
            });

            dispatch({
                type: USER_DETAILS_SUCCESS,
                payload: data.data.user,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: DELETE_USER_ADDRESS_FAIL,
                payload: message,
            });
        }
    };
}

function getAllUsers(filterObj = {}, limit = 10, sort = "", page = 1) {
    return async (dispatch, getState) => {
        try {
            let url = `/users?page=${page}&limit=${limit}`;
            if (sort.trim()) {
                url = `/users?page=${page}&limit=${limit}&sort=${sort}`;
            }

            Object.keys(filterObj).forEach((el) => {
                if (filterObj[el].trim()) {
                    if (el === "rating") {
                        url = `${url}&${el}[gte]=${filterObj[el]}`;
                    } else {
                        url = `${url}&${el}=${filterObj[el]}`;
                    }
                }
            });

            dispatch({ type: GET_ALL_USERS_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(url, config);

            dispatch({
                type: GET_ALL_USERS_SUCCESS,
                payload: data.data.users,
                page: data.data.page,
                count: data.data.count,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ALL_USERS_FAIL,
                payload: message,
            });
        }
    };
}

function changeUserRoleHandler(userId, roleId) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: CHANGE_USER_ROLE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.patch(`/users/${userId}/roles`, { roleId }, config);

            dispatch({
                type: CHANGE_USER_ROLE_SUCCESS,
            });

            toast.success("تم تغيير الصلاحية بنجاح", { theme: "colored" });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            toast.error(`Error Updating User Data, try again later`, { theme: "colored" });

            dispatch({
                type: CHANGE_USER_ROLE_FAIL,
                payload: message,
            });
        }
    };
}

function changeUserRoleReset() {
    return { type: CHANGE_USER_ROLE_RESET };
}

function changeUserCategoriesHandler(userId, categoryId) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: CHANGE_USER_CATEGORY_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.patch(`/users/${userId}/categories`, { category: categoryId }, config);

            dispatch({
                type: CHANGE_USER_CATEGORY_SUCCESS,
            });

            toast.success("تم تغيير الصلاحية بنجاح", { theme: "colored" });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            toast.error(`Error Updating User Data, try again later`, { theme: "colored" });

            dispatch({
                type: CHANGE_USER_CATEGORY_FAIL,
                payload: message,
            });
        }
    };
}

function changeUserCategoriesReset() {
    return { type: CHANGE_USER_CATEGORY_RESET };
}

export {
    getUserDetails,
    updateUserProfile,
    addNewUserAddress,
    getAddressDetails,
    updateUserAddress,
    deleteUserAddress,
    getAllUsers,
    changeUserRoleHandler,
    changeUserRoleReset,
    changeUserCategoriesHandler,
    changeUserCategoriesReset,
};
