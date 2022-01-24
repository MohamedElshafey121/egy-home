import axios from "axios";
import { toast } from "react-toastify";

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
    DELETE_BRAND_REQUEST,
    DELETE_BRAND_SUCCESS,
    DELETE_BRAND_FAIL,
    DELETE_BRAND_RESET,
} from "./brandActionTypes";

function getAllBrands(filterObj = {}, limit = 100, sort = "-createdAt", page = 1) {
    return async (dispatch) => {
        try {
            let url = `/api/brands?page=${page}&limit=${limit}`;
            if (sort.trim()) {
                url = `/api/brands?page=${page}&limit=${limit}&sort=${sort}`;
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
            dispatch({ type: GET_BRANDS_REQUEST });

            const { data } = await axios.get(url);
            dispatch({
                type: GET_BRANDS_SUCCESS,
                payload: data.data.brands,
                page: data.data.page,
                count: data.data.count,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_BRANDS_FAIL,
                payload: message,
            });
        }
    };
}

function createBrandHnadler(brand) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: CREATE_BRAND_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post("/api/brands", brand, config);
            dispatch({
                type: CREATE_BRAND_SUCCESS,
            });

            toast.success(`Brand " ${data.data.brand.name} " created Successfully`, {
                theme: "colored",
            });

            // localStorage.setItem('addProduct',JSON.stringify(newProduct))
        } catch (error) {
            // 1)error
            if (error) {
                const message =
                    error.response && error.response.data.message ? error.response.data.message : error.message;

                dispatch({
                    type: CREATE_BRAND_FAIL,
                    payload: message,
                });
                toast.error(`Error while creating new brand, try again later`, {
                    theme: "colored",
                });
            }
        }
    };
}

function createBrandReset() {
    return { type: CREATE_BRAND_RESET };
}

function getOneBrand(brandId) {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_ONE_BRAND_REQUEST });

            const { data } = await axios.get(`/api/brands/${brandId}`);
            dispatch({
                type: GET_ONE_BRAND_SUCCESS,
                payload: data.data.data,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_BRAND_FAIL,
                payload: message,
            });
        }
    };
}

function updateBrandHnadler(brandId, brand) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: UPDATE_BRAND_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.patch(`/api/brands/${brandId}`, brand, config);
            dispatch({
                type: UPDATE_BRAND_SUCCESS,
            });

            toast.success(`Brand " ${data.data.data.name} " updated Successfully`, {
                theme: "colored",
            });

            // localStorage.setItem('addProduct',JSON.stringify(newProduct))
        } catch (error) {
            console.log(error.response);
            // 1)error
            if (error) {
                const message =
                    error.response && error.response.data.message ? error.response.data.message : error.message;

                dispatch({
                    type: UPDATE_BRAND_FAIL,
                    payload: message,
                });
                toast.error(`Error while updating brand, try again later`, {
                    theme: "colored",
                });
            }
        }
    };
}

function updateBrandReset() {
    return { type: UPDATE_BRAND_RESET };
}

function deleteOneBrand(brandId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "application/json",
                },
            };

            dispatch({ type: DELETE_BRAND_REQUEST });

            await axios.delete(`/api/brands/${brandId}`, config);
            dispatch({
                type: DELETE_BRAND_SUCCESS,
            });
            toast.success("brand deleted successfully", { theme: "colored" });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: DELETE_BRAND_FAIL,
                payload: message,
            });
            toast.error("Error deleting brand", { theme: "colored" });
        }
    };
}

function deleteBrandReset() {
    return { type: DELETE_BRAND_RESET };
}

export {
    getAllBrands,
    createBrandHnadler,
    createBrandReset,
    getOneBrand,
    updateBrandHnadler,
    updateBrandReset,
    deleteOneBrand,
    deleteBrandReset,
};
