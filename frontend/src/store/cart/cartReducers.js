import { toast } from "react-toastify";
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    EMPTY_CART,
    RESET_CART,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_ADD_ITEM_REQUEST,
    CART_ADD_ITEM_SUCCESS,
    CART_ADD_ITEM_FAIL,
    GET_CART_ITEM_REQUEST,
    GET_CART_ITEM_SUCCESS,
    GET_CART_ITEM_FAIL,
    CART_REMOVE_ITEM_REQUEST,
    CART_REMOVE_ITEM_SUCCESS,
    CART_REMOVE_ITEM_FAIL,
    CART_UPDATE_ITEM_REQUEST,
    CART_UPDATE_ITEM_SUCCESS,
    CART_UPDATE_ITEM_FAIL,
    EMPTY_CART_REQUEST,
    EMPTY_CART_SUCCESS,
    EMPTY_CART_FAIL,
    USER_CART_SAVE_SHIPPING_ADDRESS_REQUEST,
    USER_CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
    USER_CART_SAVE_SHIPPING_ADDRESS_FAIL,
} from "./cartActionsTypes";

export function userCartReducer(state = { cartItems: [], shippingAddress: {} }, action) {
    switch (action.type) {
        case GET_CART_ITEM_REQUEST:
            return { loading: true };
        case GET_CART_ITEM_SUCCESS:
            return {
                loading: false,
                success: true,
                ...state,
                user: action.user,
                cartItems: action.payload,
            };
        case GET_CART_ITEM_FAIL:
            return {
                loading: false,
                ...state,
                error: action.payload,
            };
        case USER_CART_SAVE_SHIPPING_ADDRESS_SUCCESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };
        default:
            return state;
    }
}

//add cart item =>loged in user
export function addCartItemReducer(state = {}, action) {
    switch (action.type) {
        case CART_ADD_ITEM_REQUEST:
            return { loading: true };
        case CART_ADD_ITEM_SUCCESS:
            return { loading: false, success: true };
        case CART_ADD_ITEM_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//remove cart item =>logged in user
export function removeCartItemReducer(state = {}, action) {
    switch (action.type) {
        case CART_REMOVE_ITEM_REQUEST:
            return { loading: true };
        case CART_REMOVE_ITEM_SUCCESS:
            return { loading: false, success: true, deletedItem: action.deletedItem };
        case CART_REMOVE_ITEM_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//update cart item =>logged in user
export function updateCartItemReducer(state = {}, action) {
    switch (action.type) {
        case CART_UPDATE_ITEM_REQUEST:
            return { loading: true };
        case CART_UPDATE_ITEM_SUCCESS:
            return { loading: false, success: true };
        case CART_UPDATE_ITEM_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//empty shoppinf cart ?
export function emptyUserCartReducer(state = {}, action) {
    switch (action.type) {
        case EMPTY_CART_REQUEST:
            return { loading: true };
        case EMPTY_CART_SUCCESS:
            return { loading: false, success: true };
        case EMPTY_CART_FAIL:
            return { loading: false };
        default:
            return state;
    }
}

export function cartReducer(state = { cartItems: [], shippingAddress: {} }, action) {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;

            const existItem = state.cartItems.find((el) => el.product === item.product);

            if (existItem) {
                //just iterate through items without remove or add any item
                return {
                    ...state,
                    cartItems: state.cartItems.map((el) => (el.product === existItem.product ? item : el)),
                };
            } else {
                //push the new item to the existing ones
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((el) => el.product !== action.payload),
            };

        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            };

        case EMPTY_CART:
            return {
                ...state,
                cartItems: [],
                shippingAddress: {},
                paymentMethod: null,
            };
        case RESET_CART:
            return {
                ...state,
                shippingAddress: {},
                paymentMethod: null,
            };

        default:
            return state;
    }
}
