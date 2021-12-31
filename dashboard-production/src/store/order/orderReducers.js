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
    GET_RECENT_ORDERS_REQUEST,
    GET_RECENT_ORDERS_SUCCESS,
    GET_RECENT_ORDERS_FAIL,
    ADMIN_UPDATE_ORDER_REQUEST,
    ADMIN_UPDATE_ORDER_SUCCESS,
    ADMIN_UPDATE_ORDER_FAIL,
    ADMIN_UPDATE_ORDER_RESET,
} from "./orderActionsTypes";

function orderCreateReducer(state = {}, action) {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return { loading: true };
        case ORDER_CREATE_SUCCESS:
            return { loading: false, success: true, order: action.payload };
        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//get only loged user order
function OrdersMyListReducer(state = { orders: [] }, action) {
    switch (action.type) {
        case ORDER_MY_LIST_REQUEST:
            return { loading: true };
        case ORDER_MY_LIST_SUCCESS:
            return { loading: false, success: true, orders: action.payload };
        case ORDER_MY_LIST_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_MY_LIST_RESET:
            return {};
        default:
            return state;
    }
}

//all orders for admin
function OrdersListReducer(state = { orders: [] }, action) {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return { loading: true };
        case ORDER_LIST_SUCCESS:
            return { loading: false, success: true, orders: action.payload };
        case ORDER_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//get order
function orderGetReducer(state = { orderItems: [] }, action) {
    switch (action.type) {
        case GET_ORDER_REQUEST:
            return { loading: true };
        case GET_ORDER_SUCCESS:
            return { loading: false, order: action.payload };
        case GET_ORDER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//cancel order
function orderCancelReducer(state = {}, action) {
    switch (action.type) {
        case CANCEL_ORDER_REQUEST:
            return { loading: true };
        case CANCEL_ORDER_SUCCESS:
            return { loading: false, success: true };
        case CANCEL_ORDER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function userOrdersListReducer(state = { orders: null }, action) {
    switch (action.type) {
        case GET_USER_ORDERS_LIST_REQUEST:
            return { loading: true };
        case GET_USER_ORDERS_LIST_SUCCESS:
            return { loading: false, orders: action.payload };
        case GET_USER_ORDERS_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//all orders for admin
function recentOrdersReducer(state = { orders: [] }, action) {
    switch (action.type) {
        case GET_RECENT_ORDERS_REQUEST:
            return { loading: true };
        case GET_RECENT_ORDERS_SUCCESS:
            return { loading: false, success: true, orders: action.payload };
        case GET_RECENT_ORDERS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function adminUpdateOrderReducer(state = {}, action) {
    switch (action.type) {
        case ADMIN_UPDATE_ORDER_REQUEST:
            return { loading: true };
        case ADMIN_UPDATE_ORDER_SUCCESS:
            return { loading: false, success: true };
        case ADMIN_UPDATE_ORDER_FAIL:
            return { loading: false, error: action.payload };
        case ADMIN_UPDATE_ORDER_RESET:
            return {};
        default:
            return state;
    }
}

export {
    orderCreateReducer,
    OrdersMyListReducer,
    OrdersListReducer,
    orderGetReducer,
    orderCancelReducer,
    userOrdersListReducer,
    recentOrdersReducer,
    adminUpdateOrderReducer,
};
