import axios from "axios";
import { toast } from "react-toastify";

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

export function handleGetAllCategories(filterObj = {}, limit = 10, sort = "", page = 1) {
    return async (dispatch, getState) => {
        try {
            let url = `/api/categories?page=${page}&limit=${limit}`;
            if (sort.trim()) {
                url = `/api/categories?page=${page}&limit=${limit}&sort=${sort}`;
            }

            Object.keys(filterObj).forEach((el) => {
                if (filterObj[el].trim()) {
                    if (el === "rating") {
                        url = `${url}&${el}[gte]=${filterObj[el]}`;
                    } else {
                        url = `${url}&${el}=${filterObj[el]}`;
                    }
                }
            });

            // const { userLogin: { userInfo } } = getState();
            dispatch({ type: GET_CATEGORIES_REQUEST });

            // const config = {
            //     headers: {
            //         Authorization:`Bearer ${userInfo.token}`
            //     }
            // }

            const { data } = await axios.get(url);
            dispatch({
                type: GET_CATEGORIES_SUCCESS,
                payload: data.data.categories,
                page: data.data.page,
                count: data.data.count,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_CATEGORIES_FAIL,
                payload: message,
            });
        }
    };
}

export function createCategoryReset() {
    return { type: CRAETE_CATEGORIE_RESET };
}

export function handleCreateCategory(category) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: CRAETE_CATEGORIE_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post("/api/categories", category, config);
            dispatch({
                type: CRAETE_CATEGORIE_SUCCESS,
                payload: data.data.data,
            });
            toast.success(" تم إضافة الفئة بنجاح ", {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CRAETE_CATEGORIE_FAIL,
                payload: message,
            });
            toast.error("خطأ! يرجى التحقق من البيانات المدخلة ", {
                theme: "colored",
            });
        }
    };
}

export function getTopCategories() {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_MAIN_CATEGORIES_REQUEST });

            const { data } = await axios.get("/api/categories/main");
            dispatch({
                type: GET_MAIN_CATEGORIES_SUCCESS,
                payload: data.data.categories,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_MAIN_CATEGORIES_FAIL,
                payload: message,
            });
        }
    };
}

export function getOneCategory(categoryId) {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_ONE_CATEGORY_REQUEST });

            const { data } = await axios.get(`/api/categories/${categoryId}`);
            dispatch({
                type: GET_ONE_CATEGORY_SUCCESS,
                payload: data.data.data,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_CATEGORY_FAIL,
                payload: message,
            });
        }
    };
}

export function updateOneCategory(categoryId, newData) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: UPDATE_CATEGORIE_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch(`/api/categories/${categoryId}`, newData, config);
            dispatch({
                type: UPDATE_CATEGORIE_SUCCESS,
            });

            toast.success(" تم تعديل الفئة بنجاح ", {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: UPDATE_CATEGORIE_FAIL,
                payload: message,
            });

            toast.error("خطأ! يرجى التحقق من البيانات المدخلة ", {
                theme: "colored",
            });
        }
    };
}

export function updateOneCategoryReset() {
    return { type: UPDATE_CATEGORIE_RESET };
}
