import axios from "axios";
import { promisify } from "util";
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

async function getDetailedCategory(categories) {
    const dataArr = [];
    categories.forEach(async (category) => {
        const { data } = await axios.get(`/api/categories/${category._id}`);
        dataArr.push(data.data.data);
    });
    return dataArr;
}

function getHomePageCategories() {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GET_HOM_PAGE_CATEGORIES_REQUEST });

            const { data } = await axios.get(`/api/categories?limit=6`);
            const categories = data.data.categories;
            const homeCategories = await getDetailedCategory(categories);
            dispatch({
                type: GET_HOM_PAGE_CATEGORIES_SUCCESS,
                payload: homeCategories,
                page: data.data.page,
                count: data.data.count,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_HOM_PAGE_CATEGORIES_FAIL,
                payload: message,
            });
        }
    };
}

function getHomePageNewArrivaProducts(categoryId = null) {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_NEW_ARRIVAL_REQUEST });

            let link = `/api/products/recent?limit=10`;
            if (categoryId) {
                link = `/api/products/recent/${categoryId}?limit=10`;
            }
            const { data } = await axios.get(link);
            dispatch({
                type: GET_NEW_ARRIVAL_SUCCESS,
                payload: data.data.products,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_NEW_ARRIVAL_FAIL,
                payload: message,
            });
        }
    };
}

function getHomePageTopRatedProducts(categoryId = null) {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_TOP_RATED_REQUEST });

            let link = `/api/products/top`;
            if (categoryId) {
                link = `/api/products/top/${categoryId}`;
            }
            const { data } = await axios.get(link);
            dispatch({
                type: GET_TOP_RATED_SUCCESS,
                payload: data.data.products,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_TOP_RATED_FAIL,
                payload: message,
            });
        }
    };
}

function getHomePageBrands() {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_HOME_PAGE_BRANDS_REQUEST });

            const { data } = await axios.get("/api/brands?limit=20");
            dispatch({
                type: GET_HOME_PAGE_BRANDS_SUCCESS,
                payload: data.data.brands,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_HOME_PAGE_BRANDS_FAIL,
                payload: message,
            });
        }
    };
}

function getSearchCategories() {
    return async (dispatch, getState) => {
        try {
            let url = `/api/categories?limit=1000`;

            dispatch({ type: GET_SEARCH_CATEGORIES_REQUEST });

            const { data } = await axios.get(url);
            dispatch({
                type: GET_SEARCH_CATEGORIES_SUCCESS,
                payload: data.data.categories,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_SEARCH_CATEGORIES_FAIL,
                payload: message,
            });
        }
    };
}

function getSuggestedSearchProducts(name, categoryId = null) {
    return async (dispatch) => {
        try {
            let url = `/api/products?&limit=5&name=${name}`;
            if (categoryId) {
                url = `/api/products?&limit=5&name=${name}&category=${categoryId}`;
            }
            dispatch({ type: GET_SUGGESTED_PRODUCTS_REQUEST });

            const { data } = await axios.get(url);

            dispatch({
                type: GET_SUGGESTED_PRODUCTS_SUCCESS,
                payload: data.data.products,
                page: data.data.page,
                count: data.data.count,
                category: data.data.category,
            });

            return data.data.products;
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_SUGGESTED_PRODUCTS_FAIL,
                payload: message,
            });
        }
    };
}

export {
    getHomePageCategories,
    getHomePageNewArrivaProducts,
    getHomePageTopRatedProducts,
    getHomePageBrands,
    getSearchCategories,
    getSuggestedSearchProducts,
};
