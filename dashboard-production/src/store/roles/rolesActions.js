import axios from "axios";
import { toast } from "react-toastify";
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
    CREATE_NEW_ROLE_REQUEST,
    CREATE_NEW_ROLE_SUCCESS,
    CREATE_NEW_ROLE_FAIL,
    REMOVE_PERMISSION_FROM_ROLE_REQUEST,
    REMOVE_PERMISSION_FROM_ROLE_SUCCESS,
    REMOVE_PERMISSION_FROM_ROLE_FAIL,
} from "./rolesActionTypes";

function getAllRoles() {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: GET_ALL_ROLES_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get("/api/roles", config);

            return dispatch({
                type: GET_ALL_ROLES_SUCCESS,
                payload: data.data.roles,
                page: data.data.page,
                count: data.data.count,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ALL_ROLES_FAIL,
                payload: message,
            });
            toast.error("خطأ فى التحميل يرجى المحاولة مرة اخرى", {
                theme: "colored",
            });
        }
    };
}

function getOneRoles(roleId) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: GET_ONE_ROLE_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/api/roles/${roleId}`, config);

            return dispatch({
                type: GET_ONE_ROLE_SUCCESS,
                payload: data.data.role,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_ROLE_FAIL,
                payload: message,
            });
            toast.error("خطأ فى التحميل يرجى المحاولة مرة اخرى", {
                theme: "colored",
            });
        }
    };
}

function addPermissionToRole(roleId, permissionId) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ADD_PERMISSION_TO_ROLE_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch(`/api/roles/${roleId}`, { permissionId }, config);

            return dispatch({
                type: ADD_PERMISSION_TO_ROLE_SUCCESS,
                // payload: data.data.role,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: ADD_PERMISSION_TO_ROLE_FAIL,
                payload: message,
            });
            toast.error("خطأ فى التحميل يرجى المحاولة مرة اخرى", {
                theme: "colored",
            });
        }
    };
}

function createNewRole(roleData) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: CREATE_NEW_ROLE_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(`/api/roles/`, roleData, config);

            return dispatch({
                type: CREATE_NEW_ROLE_SUCCESS,
                // payload: data.data.role,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CREATE_NEW_ROLE_FAIL,
                payload: message,
            });
            toast.error("خطأ فى التحميل يرجى المحاولة مرة اخرى", {
                theme: "colored",
            });
        }
    };
}

function removePermissionFromRole(roleId, permissionId) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: REMOVE_PERMISSION_FROM_ROLE_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.delete(`/api/roles/${roleId}/permissions/${permissionId}`, config);

            return dispatch({
                type: REMOVE_PERMISSION_FROM_ROLE_SUCCESS,
                // payload: data.data.role,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: REMOVE_PERMISSION_FROM_ROLE_FAIL,
                payload: message,
            });
            toast.error("خطأ فى التحميل يرجى المحاولة مرة اخرى", {
                theme: "colored",
            });
        }
    };
}

export { getAllRoles, getOneRoles, addPermissionToRole, createNewRole, removePermissionFromRole };
