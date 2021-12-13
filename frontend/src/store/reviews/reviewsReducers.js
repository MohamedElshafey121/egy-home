import {
    CREATE_PRODUCT_REVIEW_REQUEST,
    CREATE_PRODUCT_REVIEW_SUCCESS,
    CREATE_PRODUCT_REVIEW_FAIL,
} from "./reviewsActionTypes";

function createProductReviewReducer(state = {}, action) {
    switch (action.type) {
        case CREATE_PRODUCT_REVIEW_REQUEST:
            return { loading: true };
        case CREATE_PRODUCT_REVIEW_SUCCESS:
            return { loading: false, success: true };
        case CREATE_PRODUCT_REVIEW_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export { createProductReviewReducer };
