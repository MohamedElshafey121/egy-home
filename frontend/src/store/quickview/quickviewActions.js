import axios from "axios";
// import shopApi from "../../api/shop";
import { QUICKVIEW_CLOSE, QUICKVIEW_OPEN } from "./quickviewActionTypes";
import { GET_ONE_PRODUCT_SUCCESS } from "../product/prpductsActionTypes";

let cancelPreviousRequest = () => {};

export function quickviewOpenSuccess(product) {
    return {
        type: QUICKVIEW_OPEN,
        product,
    };
}

export function quickviewClose() {
    return {
        type: QUICKVIEW_CLOSE,
    };
}

// export function quickviewOpen(productSlug) {
//     return (dispatch) => {
//         cancelPreviousRequest();

//         return new Promise((resolve) => {
//             let canceled = false;
//             // sending request to server, timeout is used as a stub
//             const timer = setTimeout(() => {
//                 shopApi.getProductBySlug(productSlug).then((product) => {
//                     if (canceled) {
//                         return;
//                     }

//                     if (product) {
//                         dispatch(quickviewOpenSuccess(product));
//                     }

//                     resolve();
//                 });
//             }, 350);

//             cancelPreviousRequest = () => {
//                 canceled = true;
//                 clearTimeout(timer);
//                 resolve();
//             };
//         });
//     };
// }

export function quickviewOpen(productId) {
    return (dispatch) => {
        cancelPreviousRequest();

        return new Promise((resolve) => {
            let canceled = false;
            // sending request to server, timeout is used as a stub
            const timer = setTimeout(() => {
                axios.get(`/api/products/${productId}`).then(({ data }) => {
                    if (canceled) {
                        return;
                    }

                    if (data.product) {
                        dispatch({
                            type: GET_ONE_PRODUCT_SUCCESS,
                            payload: data.product,
                        });
                        dispatch(quickviewOpenSuccess(data.product));
                    }

                    resolve();
                });
            }, 350);

            cancelPreviousRequest = () => {
                canceled = true;
                clearTimeout(timer);
                resolve();
            };
        });
    };
}
