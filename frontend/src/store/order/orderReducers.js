import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_MY_LIST_REQUEST,
    ORDER_MY_LIST_SUCCESS,
    ORDER_MY_LIST_FAIL,
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
    CHECK_TRACK_ORDER_REQUEST,
    CHECK_TRACK_ORDER_SUCCESS,
    CHECK_TRACK_ORDER_FAIL,
    CHECK_TRACK_ORDER_RESET,
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

//check track order
function checkTrackOrderReducer(state = {}, action) {
    switch (action.type) {
        case CHECK_TRACK_ORDER_REQUEST:
            return { loading: true };
        case CHECK_TRACK_ORDER_SUCCESS:
            return { loading: false, success: true };
        case CHECK_TRACK_ORDER_FAIL:
            return { loading: false, error: action.payload };
        case CHECK_TRACK_ORDER_RESET:
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
    checkTrackOrderReducer,
};
