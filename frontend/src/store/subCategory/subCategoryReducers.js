import {
    GET_SUB_CATEGORIES_REQUEST,
    GET_SUB_CATEGORIES_SUCCESS,
    GET_SUB_CATEGORIES_FAIL,
    GET_SUB_CATEGORIES_RESEST,
    CREATE_SUB_CATEGORY_REQUEST,
    CREATE_SUB_CATEGORY_SUCCESS,
    CREATE_SUB_CATEGORY_FAIL,
    CREATE_SUB_CATEGORY_RESET,
    GET_ONE_SUB_CATEGORY_REQUEST,
    GET_ONE_SUB_CATEGORY_SUCCESS,
    GET_ONE_SUB_CATEGORY_FAIL,
    UPDATE_SUB_CATEGORY_REQUEST,
    UPDATE_SUB_CATEGORY_SUCCESS,
    UPDATE_SUB_CATEGORY_FAIL,
    UPDATE_SUB_CATEGORY_RESET,
} from "./subCategoryActionTypes";

export function getSubCategories(state = { SubCategories: null }, action) {
    switch (action.type) {
        case GET_SUB_CATEGORIES_REQUEST:
            return { loading: true };
        case GET_SUB_CATEGORIES_SUCCESS:
            return {
                loading: false,
                SubCategories: action.payload,
                success: true,
                page: action.page,
                count: action.count,
            };
        case GET_SUB_CATEGORIES_FAIL:
            return { loading: false, error: action.payload };
        case GET_SUB_CATEGORIES_RESEST:
            return { SubCategories: [] };
        default:
            return state;
    }
}

export function createSubCategoryReducer(state = {}, action) {
    switch (action.type) {
        case CREATE_SUB_CATEGORY_REQUEST:
            return { loading: true };
        case CREATE_SUB_CATEGORY_SUCCESS:
            return { loading: false, subCategory: action.payload, success: true };
        case CREATE_SUB_CATEGORY_FAIL:
            return { loading: false, error: action.payload };
        case CREATE_SUB_CATEGORY_RESET:
            return {};
        default:
            return state;
    }
}

export function getOneSubCategoryReducer(state = { subCategory: {} }, action) {
    switch (action.type) {
        case GET_ONE_SUB_CATEGORY_REQUEST:
            return { loading: true };
        case GET_ONE_SUB_CATEGORY_SUCCESS:
            return { loading: false, subCategory: action.payload };
        case GET_ONE_SUB_CATEGORY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function updateSubcategoryReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_SUB_CATEGORY_REQUEST:
            return { loading: true };
        case UPDATE_SUB_CATEGORY_SUCCESS:
            return { loading: false, success: true };
        case UPDATE_SUB_CATEGORY_FAIL:
            return { loading: false, error: action.payload };
        case UPDATE_SUB_CATEGORY_RESET:
            return {};
        default:
            return state;
    }
}
