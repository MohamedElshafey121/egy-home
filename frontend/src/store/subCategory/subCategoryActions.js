import axios from "axios";
import { toast } from "react-toastify";
/**
 * toast.success(`Category " ${data.data.data.name} " created Successfully`, {
        theme: "colored",
    });

    toast.error(`Error while creating new Category, try again later`, {
        theme: "colored",
    });
 */
import {
    GET_SUB_CATEGORIES_REQUEST,
    GET_SUB_CATEGORIES_SUCCESS,
    GET_SUB_CATEGORIES_FAIL,
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
    GET_CATEGORY_SUBCATEGORIES_REQUEST,
    GET_CATEGORY_SUBCATEGORIES_SUCCESS,
    GET_CATEGORY_SUBCATEGORIES_FAIL,
} from "./subCategoryActionTypes";

//get sub categories belong to a specific category
export function handleGetAllCategorySubCategories(categoryId = null) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: GET_CATEGORY_SUBCATEGORIES_REQUEST,
            });

            const { data } = await axios.get(`/api/categories/subCategories/${categoryId}?limit=20`);

            return dispatch({
                type: GET_CATEGORY_SUBCATEGORIES_SUCCESS,
                payload: data.data.subcategories,
                page: data.data.page,
                count: data.data.count,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_CATEGORY_SUBCATEGORIES_FAIL,
                payload: message,
            });
            toast.error(`Error while loading Sub Categories, Please Refresh the page`, {
                theme: "colored",
            });
        }
    };
}

//get all categories && sub categories belong to a specific category
export function handleGetAllSubCategories(filterObj = {}, limit = 10, sort = "", page = 1, categoryId = null) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: GET_SUB_CATEGORIES_REQUEST,
            });

            // const { userLogin: { userInfo } } = getState();

            // const config = {
            //     headers: {
            //         Authorization: `Bearer ${ userInfo.token }`
            //     }
            // };

            if (categoryId) {
                const { data } = await axios.get(`/api/categories/subCategories/${categoryId}?limit=20`);

                return dispatch({
                    type: GET_SUB_CATEGORIES_SUCCESS,
                    payload: data.data.subcategories,
                    page: data.data.page,
                    count: data.data.count,
                });
            }

            //If not category Id
            let url = `/api/categories/sub?page=${page}&limit=${limit}`;
            if (sort.trim()) {
                url = `/api/categories/sub?page=${page}&limit=${limit}&sort=${sort}`;
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

            const { data } = await axios.get(url);

            return dispatch({
                type: GET_SUB_CATEGORIES_SUCCESS,
                payload: data.data.subcategories,
                page: data.data.page,
                count: data.data.count,
            });

            // return data.data.data;
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_SUB_CATEGORIES_FAIL,
                payload: message,
            });
            toast.error(`Error while loading Sub Categories, Please Refresh the page`, {
                theme: "colored",
            });
        }
    };
}

export function handleCreateSubCategory(subCategory) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: CREATE_SUB_CATEGORY_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(`/api/categories/sub`, subCategory, config);

            dispatch({
                type: CREATE_SUB_CATEGORY_SUCCESS,
                payload: data.data.subCategory,
            });

            toast.success(" تم إضافة الفئة بنجاح ", {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: CREATE_SUB_CATEGORY_FAIL,
                payload: message,
            });
            toast.success(" خطأ! يرجى التحقق من البيانات المدخلة ", {
                theme: "colored",
            });
        }
    };
}

export function createSubcategoryReset() {
    return { type: CREATE_SUB_CATEGORY_RESET };
}

export function getOneSubcategory(categoryId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: UPDATE_SUB_CATEGORY_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            dispatch({ type: GET_ONE_SUB_CATEGORY_REQUEST });

            const { data } = await axios.get(`/api/categories/sub/${categoryId}`, config);
            dispatch({
                type: GET_ONE_SUB_CATEGORY_SUCCESS,
                payload: data.data.data,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_SUB_CATEGORY_FAIL,
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
            dispatch({ type: UPDATE_SUB_CATEGORY_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.patch(`/api/categories/sub/${categoryId}`, newData, config);
            dispatch({
                type: UPDATE_SUB_CATEGORY_SUCCESS,
            });
            toast.success(" تم تعديل الفئة بنجاح ", {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: UPDATE_SUB_CATEGORY_FAIL,
                payload: message,
            });

            toast.error(" خطأ! يرجى التحقق من البيانات ", {
                theme: "colored",
            });
        }
    };
}

export function updateOneSubcategoryReset() {
    return { type: UPDATE_SUB_CATEGORY_RESET };
}
