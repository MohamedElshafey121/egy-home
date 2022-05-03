import {
    ADD_PRODUCT_REQUESTED,
    ADD_PRODUCT_SUCCESS,
    ADD_PRODUCT_FAIL,
    ADD_PRODUCT_RESET,
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL,
    GET_ONE_PRODUCT_REQUEST,
    GET_ONE_PRODUCT_SUCCESS,
    GET_ONE_PRODUCT_FAIL,
    ADD_PRODUCT_SPECIFICATION_REQUEST,
    ADD_PRODUCT_SPECIFICATION_SUCCESS,
    ADD_PRODUCT_SPECIFICATION_FAIL,
    ADD_PRODUCT_SPECIFICATION_RESET,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_SPECIFICATION_REQUEST,
    UPDATE_PRODUCT_SPECIFICATION_SUCCESS,
    UPDATE_PRODUCT_SPECIFICATION_FAIL,
    UPDATE_PRODUCT_SPECIFICATION_RESET,
    DELETE_PRODUCT_SPECIFICATION_REQUEST,
    DELETE_PRODUCT_SPECIFICATION_SUCCESS,
    DELETE_PRODUCT_SPECIFICATION_FAIL,
    DELETE_PRODUCT_SPECIFICATION_RESET,
    GET_ONE_PRODUCT_SPECIFICATION_REQUEST,
    GET_ONE_PRODUCT_SPECIFICATION_SUCCESS,
    GET_ONE_PRODUCT_SPECIFICATION_FAIL,
    GET_ONE_PRODUCT_SPECIFICATION_RESET,
    GET_TOP_PRODUCTS_REQUEST,
    GET_TOP_PRODUCTS_SUCCESS,
    GET_TOP_PRODUCTS_FAIL,
    GET_RECENT_PRODUCTS_REQUEST,
    GET_RECENT_PRODUCTS_SUCCESS,
    GET_RECENT_PRODUCTS_FAIL,
    GET_RELATED_PRODUCTS_REQUEST,
    GET_RELATED_PRODUCTS_SUCCESS,
    GET_RELATED_PRODUCTS_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_RESET,
} from "./prpductsActionTypes";

export function addProductReducer(state = {}, action) {
    switch (action.type) {
        case ADD_PRODUCT_REQUESTED:
            return { loading: true };
        case ADD_PRODUCT_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case ADD_PRODUCT_FAIL:
            return { loading: false, error: action.payload };
        case ADD_PRODUCT_RESET:
            return {};
        default:
            return state;
    }
}

export function allProductsReducer(state = { products: [] }, action) {
    switch (action.type) {
        case GET_PRODUCTS_REQUEST:
            return { loading: true, products: [] };
        case GET_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload,
                page: action.page,
                count: action.count,
                category: action.category,
            };
        case GET_PRODUCTS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function getOneProductReducer(state = { product: { Specifications: [], reviews: [] } }, action) {
    switch (action.type) {
        case GET_ONE_PRODUCT_REQUEST:
            return { loading: true, ...state };
        case GET_ONE_PRODUCT_SUCCESS:
            return { loading: false, product: action.payload, success: true };
        case GET_ONE_PRODUCT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function addProductSpecificationReducer(state = {}, action) {
    switch (action.type) {
        case ADD_PRODUCT_SPECIFICATION_REQUEST:
            return { loading: true };
        case ADD_PRODUCT_SPECIFICATION_SUCCESS:
            return { loading: false, product: action.payload, success: true };
        case ADD_PRODUCT_SPECIFICATION_FAIL:
            return { loading: false, error: action.payload };
        case ADD_PRODUCT_SPECIFICATION_RESET:
            return {};
        default:
            return state;
    }
}

export function updateProductReducer(state = { product: { Specifications: [], reviews: [] } }, action) {
    switch (action.type) {
        case UPDATE_PRODUCT_REQUEST:
            return { loading: true };
        case UPDATE_PRODUCT_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case UPDATE_PRODUCT_FAIL:
            return { loading: false, error: action.payload };
        case UPDATE_PRODUCT_RESET:
            return {};
        default:
            return state;
    }
}

export function updateProductSpecificationReducer(state = { product: { Specifications: [], reviews: [] } }, action) {
    switch (action.type) {
        case UPDATE_PRODUCT_SPECIFICATION_REQUEST:
            return { loading: true };
        case UPDATE_PRODUCT_SPECIFICATION_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case UPDATE_PRODUCT_SPECIFICATION_FAIL:
            return { loading: false, error: action.payload };
        case UPDATE_PRODUCT_SPECIFICATION_RESET:
            return {};
        default:
            return state;
    }
}

export function deleteProductSpecificationReducer(state = {}, action) {
    switch (action.type) {
        case DELETE_PRODUCT_SPECIFICATION_REQUEST:
            return { loading: true };
        case DELETE_PRODUCT_SPECIFICATION_SUCCESS:
            return { loading: false, success: true };
        case DELETE_PRODUCT_SPECIFICATION_FAIL:
            return { loading: false, error: action.payload };
        case DELETE_PRODUCT_SPECIFICATION_RESET:
            return {};
        default:
            return state;
    }
}

export function getOneProductSpecificationReducer(state = { specification: {} }, action) {
    switch (action.type) {
        case GET_ONE_PRODUCT_SPECIFICATION_REQUEST:
            return { loading: true };
        case GET_ONE_PRODUCT_SPECIFICATION_SUCCESS:
            return { loading: false, specification: action.payload, success: true };
        case GET_ONE_PRODUCT_SPECIFICATION_FAIL:
            return { loading: false, error: action.payload };
        case GET_ONE_PRODUCT_SPECIFICATION_RESET:
            return { specification: {} };
        default:
            return state;
    }
}

export function topProductsReducer(state = { products: [] }, action) {
    switch (action.type) {
        case GET_TOP_PRODUCTS_REQUEST:
            return { loading: true, products: [] };
        case GET_TOP_PRODUCTS_SUCCESS:
            return { loading: false, products: action.payload };
        case GET_TOP_PRODUCTS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function recentProductsReducer(state = { products: null }, action) {
    switch (action.type) {
        case GET_RECENT_PRODUCTS_REQUEST:
            return { loading: true, products: [] };
        case GET_RECENT_PRODUCTS_SUCCESS:
            return { loading: false, products: action.payload };
        case GET_RECENT_PRODUCTS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function relatedProductsReducer(state = { products: [] }, action) {
    switch (action.type) {
        case GET_RELATED_PRODUCTS_REQUEST:
            return { loading: true, products: [] };
        case GET_RELATED_PRODUCTS_SUCCESS:
            return { loading: false, products: action.payload };
        case GET_RELATED_PRODUCTS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function deleteProductReducer(state = {}, action) {
    switch (action.type) {
        case DELETE_PRODUCT_REQUEST:
            return { loading: true };
        case DELETE_PRODUCT_SUCCESS:
            return { loading: false, success: true };
        case DELETE_PRODUCT_FAIL:
            return { loading: false, error: action.payload };
        case DELETE_PRODUCT_RESET:
            return {};
        default:
            return state;
    }
}
