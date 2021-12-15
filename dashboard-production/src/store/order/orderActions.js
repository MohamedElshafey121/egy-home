import axios from "axios";

import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_MY_LIST_REQUEST,
    ORDER_MY_LIST_SUCCESS,
    ORDER_MY_LIST_FAIL,
    ORDER_MY_LIST_RESET,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    GET_ORDER_REQUEST,
    GET_ORDER_SUCCESS,
    GET_ORDER_FAIL,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAIL,
    GET_USER_ORDERS_LIST_REQUEST,
    GET_USER_ORDERS_LIST_SUCCESS,
    GET_USER_ORDERS_LIST_FAIL,
} from "./orderActionsTypes";

export function createOrder(order) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_CREATE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post("/api/orders", order, config);
            console.log(data.data.order);
            dispatch({
                type: ORDER_CREATE_SUCCESS,
                payload: data.data.order,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: ORDER_CREATE_FAIL,
                payload: message,
            });
        }
    };
}

export function getMyOrders() {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_MY_LIST_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get("/api/orders/me", config);
            dispatch({
                type: ORDER_MY_LIST_SUCCESS,
                payload: data.data.orders,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: ORDER_MY_LIST_FAIL,
                payload: message,
            });
        }
    };
}

//get orders list
export function getOrderslist() {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_LIST_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get("/api/orders", config);
            dispatch({
                type: ORDER_LIST_SUCCESS,
                payload: data.data.orders,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: ORDER_LIST_FAIL,
                payload: message,
            });
        }
    };
}

//get order by id
export function getOrder(orderId) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GET_ORDER_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/api/orders/${orderId}`, config);
            dispatch({
                type: GET_ORDER_SUCCESS,
                payload: data.data.order,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ORDER_FAIL,
                payload: message,
            });
        }
    };
}

//cancel order by id
export function cancelOrder(orderId, canceled = true) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: CANCEL_ORDER_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch(`/api/orders/${orderId}`, { canceled }, config);
            dispatch({ type: CANCEL_ORDER_SUCCESS });
            dispatch({
                type: GET_ORDER_SUCCESS,
                payload: data.data.data,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CANCEL_ORDER_FAIL,
                payload: message,
            });
        }
    };
}

//cancel order by id
export function markOrderAsDelivered(orderId, isDelivered = true) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: CANCEL_ORDER_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch(`/api/orders/${orderId}`, { isDelivered }, config);
            dispatch({ type: CANCEL_ORDER_SUCCESS });
            dispatch({
                type: GET_ORDER_SUCCESS,
                payload: data.data.data,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CANCEL_ORDER_FAIL,
                payload: message,
            });
        }
    };
}

//get orders list belong to specific user
export function getUserOrders(userId) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GET_USER_ORDERS_LIST_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/api/orders/users/${userId}`, config);
            dispatch({
                type: GET_USER_ORDERS_LIST_SUCCESS,
                payload: data.data.orders,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_USER_ORDERS_LIST_FAIL,
                payload: message,
            });
        }
    };
}
