import {
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAIL,
    CRAETE_CATEGORIE_REQUEST,
    CRAETE_CATEGORIE_SUCCESS,
    CRAETE_CATEGORIE_FAIL,
    CRAETE_CATEGORIE_RESET,
    GET_MAIN_CATEGORIES_REQUEST,
    GET_MAIN_CATEGORIES_SUCCESS,
    GET_MAIN_CATEGORIES_FAIL,
    GET_ONE_CATEGORY_REQUEST,
    GET_ONE_CATEGORY_SUCCESS,
    GET_ONE_CATEGORY_FAIL,
    UPDATE_CATEGORIE_REQUEST,
    UPDATE_CATEGORIE_SUCCESS,
    UPDATE_CATEGORIE_FAIL,
    UPDATE_CATEGORIE_RESET,
} from "./categoryActionTypes";

export function getCategoriesReducer(state = { categories: null }, action) {
    switch (action.type) {
        case GET_CATEGORIES_REQUEST:
            return { loading: true };
        case GET_CATEGORIES_SUCCESS:
            return {
                loading: false,
                categories: action.payload,
                page: action.page,
                count: action.count,
            };
        case GET_CATEGORIES_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function createCategoryReducer(state = {}, action) {
    switch (action.type) {
        case CRAETE_CATEGORIE_REQUEST:
            return { loading: true };
        case CRAETE_CATEGORIE_SUCCESS:
            return { loading: false, success: true };
        case CRAETE_CATEGORIE_FAIL:
            return { loading: false, error: action.payload };
        case CRAETE_CATEGORIE_RESET:
            return {};
        default:
            return state;
    }
}

export function getMainCategoriesReducer(state = { categories: [] }, action) {
    switch (action.type) {
        case GET_MAIN_CATEGORIES_REQUEST:
            return { loading: true, ...state };
        case GET_MAIN_CATEGORIES_SUCCESS:
            return { loading: false, categories: action.payload };
        case GET_MAIN_CATEGORIES_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function getOneCategoryReducer(state = { category: {} }, action) {
    switch (action.type) {
        case GET_ONE_CATEGORY_REQUEST:
            return { loading: true };
        case GET_ONE_CATEGORY_SUCCESS:
            return { loading: false, category: action.payload };
        case GET_ONE_CATEGORY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export function updateCategoryReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_CATEGORIE_REQUEST:
            return { loading: true };
        case UPDATE_CATEGORIE_SUCCESS:
            return { loading: false, success: true };
        case UPDATE_CATEGORIE_FAIL:
            return { loading: false, error: action.payload };
        case UPDATE_CATEGORIE_RESET:
            return {};
        default:
            return state;
    }
}
