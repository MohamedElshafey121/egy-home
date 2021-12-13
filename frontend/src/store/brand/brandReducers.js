import {
    GET_BRANDS_REQUEST,
    GET_BRANDS_SUCCESS,
    GET_BRANDS_FAIL,
    CREATE_BRAND_REQUEST,
    CREATE_BRAND_SUCCESS,
    CREATE_BRAND_FAIL,
    CREATE_BRAND_RESET,
    GET_ONE_BRAND_REQUEST,
    GET_ONE_BRAND_SUCCESS,
    GET_ONE_BRAND_FAIL,
    UPDATE_BRAND_REQUEST,
    UPDATE_BRAND_SUCCESS,
    UPDATE_BRAND_FAIL,
    UPDATE_BRAND_RESET,
} from "./brandActionTypes";

function getBrandsReducer(state = { brands: null }, action) {
    switch (action.type) {
        case GET_BRANDS_REQUEST:
            return { loading: true };
        case GET_BRANDS_SUCCESS:
            return {
                loading: false,
                success: true,
                brands: action.payload,
                page: action.page,
                count: action.count,
            };
        case GET_BRANDS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function createBrandReducer(state = {}, action) {
    switch (action.type) {
        case CREATE_BRAND_REQUEST:
            return { loading: true };
        case CREATE_BRAND_SUCCESS:
            return { loading: false, success: true };
        case CREATE_BRAND_FAIL:
            return { loading: false, error: action.payload };
        case CREATE_BRAND_RESET:
            return {};
        default:
            return state;
    }
}

function getOneBrandReducer(state = { brand: {} }, action) {
    switch (action.type) {
        case GET_ONE_BRAND_REQUEST:
            return { loading: true };
        case GET_ONE_BRAND_SUCCESS:
            return { loading: false, brand: action.payload };
        case GET_ONE_BRAND_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function updateBrandReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_BRAND_REQUEST:
            return { loading: true };
        case UPDATE_BRAND_SUCCESS:
            return { loading: false, success: true };
        case UPDATE_BRAND_FAIL:
            return { loading: false, error: action.payload };
        case UPDATE_BRAND_RESET:
            return {};
        default:
            return state;
    }
}

export { getBrandsReducer, createBrandReducer, getOneBrandReducer, updateBrandReducer };
