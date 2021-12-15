// third-party
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

// reducer
import rootReducer from "./rootReducer";
import version from "./version";

// function load() {
//     let state;

//     try {
//         state = localStorage.getItem('state');

//         if (typeof state === 'string') {
//             state = JSON.parse(state);
//         }

//         if (state && state.version !== version) {
//             state = undefined;
//         }
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.error(error);
//     }

//     return state || undefined;
// }

const cartItemsFromStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

const userInfoFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
};

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
        applyMiddleware(thunk)
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

function save() {
    try {
        localStorage.setItem("state", JSON.stringify(store.getState()));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}

store.subscribe(() => save());

export default store;
