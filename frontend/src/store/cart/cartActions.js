import axios from "axios";
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

/**
 * const { userLogin: { userInfo } } = getState();
            dispatch( { type: ADD_PRODUCT_SPECIFICATION_REQUEST} );

            const config = {
                headers: {
                    Authorization: `Bearer ${ userInfo.token }`,
                    "Content-Type":"multipart/form-data"
                },
            }
 */
export function getUserCart() {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            dispatch({ type: GET_CART_ITEM_REQUEST });
            const { data } = await axios.get("/api/cart", config);
            dispatch({
                type: GET_CART_ITEM_SUCCESS,
                payload: data.data.cart.cartItems,
                user: data.data.cart.user,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_CART_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

export function addToUserCart(id, properites) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            const {
                data: { product },
            } = await axios.get(`/api/products/${id}`);
            let price = null;
            let photo = null;

            if (properites.color && properites.color !== product.color) {
                const selected = product.Specifications.find((el) => el.color === properites.color);
                if (selected) {
                    price = selected.price ? selected.price : null;
                    photo = selected.photo;
                }
            }

            dispatch({
                type: CART_ADD_ITEM_REQUEST,
            });
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                "/api/cart/items",
                {
                    product: product._id,
                    name: product.name,
                    price: price ? price : product.price,
                    photo: photo ? photo : product.photo,
                    qty: properites.qty,
                    // shape: properites.shape,
                    color: properites.color,
                    size: properites.size,
                },
                config
            );

            dispatch({
                type: CART_ADD_ITEM_SUCCESS,
            });
            toast.success(` ${product.name} added to cart!`, { theme: "colored" });

            dispatch({
                type: GET_CART_ITEM_SUCCESS,
                payload: data.data.cart.cartItems,
                user: data.data.cart.user,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            toast.error(
                message === "product is already found in cart"
                    ? "العنصر موجود فى السلة بالفعل"
                    : "حدث خطأ برجاء المحاولة لاحقاُ",
                {
                    theme: "colored",
                }
            );

            console.log("Error message", message);

            dispatch({
                type: CART_ADD_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

export function removeFromUserCart(id) {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: CART_REMOVE_ITEM_REQUEST });
            const {
                userLogin: { userInfo },
            } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.delete(`/api/cart/items/${id}`, config);
            // const cartItems = data.data.cart.cartItems;
            // const deletedItem = cartItems.find( el => el._id === id );
            dispatch({
                type: CART_REMOVE_ITEM_SUCCESS,
                deletedItem: "",
            });

            dispatch({
                type: GET_CART_ITEM_SUCCESS,
                payload: data.data.cart.cartItems,
                user: data.data.cart.user,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CART_REMOVE_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

export function updateUserCartItem(itemId, itemData) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: CART_UPDATE_ITEM_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch(` /api/cart/items/${itemId}`, itemData, config);

            dispatch({
                type: CART_UPDATE_ITEM_SUCCESS,
            });

            dispatch({
                type: GET_CART_ITEM_SUCCESS,
                payload: data.data.cart.cartItems,
                user: data.data.cart.user,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CART_UPDATE_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

export function emptyUserCart() {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: EMPTY_CART_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.delete("/api/cart/items", config);

            dispatch({ type: EMPTY_CART_SUCCESS });
            dispatch({
                type: GET_CART_ITEM_SUCCESS,
                payload: data.data.cart.cartItems,
                user: data.data.cart.user,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: EMPTY_CART_FAIL,
                payload: message,
            });
        }
    };
}

export function saveUserShippingAddress(data) {
    return (dispatch) => {
        dispatch({
            type: USER_CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
            payload: data,
        });

        localStorage.setItem("shippingAddress", JSON.stringify(data));
    };
}

export function addToCart(id, properites) {
    // alert( id );
    return async (dispatch, getState) => {
        //Select / prepare Item
        const {
            data: { product },
        } = await axios.get(`/api/products/${id}`);
        let price = null;
        let photo = null;

        if (properites.color && properites.color !== product.color) {
            const selected = product.Specifications.find((el) => el.color === properites.color);
            if (selected) {
                price = selected.price ? selected.price : null;
                photo = selected.photo;
            }
        }

        toast.success("تم إضافة المنتج بنجاح إلى العربة", { theme: "colored" });

        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: product._id,
                name: product.name,
                price: price ? price : product.price,
                photo: photo ? photo : product.photo,
                qty: properites.qty,
                shape: properites.shape,
                color: properites.color,
                size: properites.size,
            },
        });

        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    };
}

export function removeFromCart(id) {
    return async (dispatch, getState) => {
        dispatch({
            type: CART_REMOVE_ITEM,
            payload: id,
        });

        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    };
}

export function emptyCart() {
    return (dispatch, getState) => {
        dispatch({
            type: EMPTY_CART,
        });

        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    };
}

export function saveShippingAddress(data) {
    return (dispatch) => {
        dispatch({
            type: CART_SAVE_SHIPPING_ADDRESS,
            payload: data,
        });

        localStorage.setItem("shippingAddress", JSON.stringify(data));
    };
}

export function savePaymentMethod(data) {
    return (dispatch) => {
        dispatch({
            type: CART_SAVE_PAYMENT_METHOD,
            payload: data,
        });

        localStorage.setItem("paymentMethod", JSON.stringify(data));
    };
}
