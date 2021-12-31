import axios from "axios";
import { toast } from "react-toastify";
import {
    CREATE_PRODUCT_REVIEW_REQUEST,
    CREATE_PRODUCT_REVIEW_SUCCESS,
    CREATE_PRODUCT_REVIEW_FAIL,
    CREATE_PRODUCT_REVIEW_RESET,
} from "./reviewsActionTypes";

function createProductReviewHandler(productId, review) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: CREATE_PRODUCT_REVIEW_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(`/api/products/${productId}/reviews`, review, config);
            dispatch({
                type: CREATE_PRODUCT_REVIEW_SUCCESS,
            });
        } catch (error) {
            // console.log(error.response);
            // 1)error
            if (error) {
                const message =
                    error.response && error.response.data.message ? error.response.data.message : error.message;

                dispatch({
                    type: CREATE_PRODUCT_REVIEW_FAIL,
                    payload: message,
                });
                toast.error(" خطأ أثناء التقييم يرجى المحاولة لاحقا ", { theme: "colored" });
            }
        }
    };
}

function resetProductReviews() {
    return { type: CREATE_PRODUCT_REVIEW_RESET };
}

export { createProductReviewHandler, resetProductReviews };
