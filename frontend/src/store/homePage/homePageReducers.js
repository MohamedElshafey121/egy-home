import {
    GET_HOM_PAGE_CATEGORIES_REQUEST,
    GET_HOM_PAGE_CATEGORIES_SUCCESS,
    GET_HOM_PAGE_CATEGORIES_FAIL,
    GET_NEW_ARRIVAL_REQUEST,
    GET_NEW_ARRIVAL_SUCCESS,
    GET_NEW_ARRIVAL_FAIL,
    GET_TOP_RATED_REQUEST,
    GET_TOP_RATED_SUCCESS,
    GET_TOP_RATED_FAIL,
    GET_HOME_PAGE_BRANDS_REQUEST,
    GET_HOME_PAGE_BRANDS_SUCCESS,
    GET_HOME_PAGE_BRANDS_FAIL,
    GET_SEARCH_CATEGORIES_REQUEST,
    GET_SEARCH_CATEGORIES_SUCCESS,
    GET_SEARCH_CATEGORIES_FAIL,
    GET_SUGGESTED_PRODUCTS_REQUEST,
    GET_SUGGESTED_PRODUCTS_SUCCESS,
    GET_SUGGESTED_PRODUCTS_FAIL,
} from "./homePageActionTypes";

function homePgaeCategoriesReducer(state = { categories: null }, action) {
    switch (action.type) {
        case GET_HOM_PAGE_CATEGORIES_REQUEST:
            return { loading: true };
        case GET_HOM_PAGE_CATEGORIES_SUCCESS:
            return { loading: false, categories: action.payload };
        case GET_HOM_PAGE_CATEGORIES_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function homePageNewArrivalProductsReducer(state = { products: null }, action) {
    switch (action.type) {
        case GET_NEW_ARRIVAL_REQUEST:
            return { loading: true };
        case GET_NEW_ARRIVAL_SUCCESS:
            return { loading: false, products: action.payload };
        case GET_NEW_ARRIVAL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

//top rated === featurd products
function homePageTopRatedProductsReducer(state = { products: null }, action) {
    switch (action.type) {
        case GET_TOP_RATED_REQUEST:
            return { loading: true };
        case GET_TOP_RATED_SUCCESS:
            return { loading: false, products: action.payload };
        case GET_TOP_RATED_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function homePgaeBrandsReducer(state = { brands: null }, action) {
    switch (action.type) {
        case GET_HOME_PAGE_BRANDS_REQUEST:
            return { loading: true };
        case GET_HOME_PAGE_BRANDS_SUCCESS:
            return { loading: false, brands: action.payload };
        case GET_HOME_PAGE_BRANDS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function getSearchCategoriesReducer(state = { categories: null }, action) {
    switch (action.type) {
        case GET_SEARCH_CATEGORIES_REQUEST:
            return { loading: true };
        case GET_SEARCH_CATEGORIES_SUCCESS:
            return {
                loading: false,
                categories: action.payload,
            };
        case GET_SEARCH_CATEGORIES_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function suggestedSearchProductsReducer(state = { products: [] }, action) {
    switch (action.type) {
        case GET_SUGGESTED_PRODUCTS_REQUEST:
            return { loading: true, products: [] };
        case GET_SUGGESTED_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload,
            };
        case GET_SUGGESTED_PRODUCTS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export {
    homePgaeCategoriesReducer,
    homePageNewArrivalProductsReducer,
    homePageTopRatedProductsReducer,
    homePgaeBrandsReducer,
    getSearchCategoriesReducer,
    suggestedSearchProductsReducer,
};
