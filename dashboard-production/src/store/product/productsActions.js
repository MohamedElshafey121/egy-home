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
    DELETE_PRODUCT_SPECIFICATION_REQUEST,
    DELETE_PRODUCT_SPECIFICATION_SUCCESS,
    DELETE_PRODUCT_SPECIFICATION_FAIL,
    DELETE_PRODUCT_SPECIFICATION_RESET,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_RESET,
} from "./prpductsActionTypes";

export function handleAddProduct(product) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: ADD_PRODUCT_REQUESTED });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.post("/api/products", product, config);
            const newProduct = data.data.product;
            dispatch({
                type: ADD_PRODUCT_SUCCESS,
                payload: newProduct,
            });
            toast.success(`تم اضافة المنتج بنجاح`, {
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
                    type: ADD_PRODUCT_FAIL,
                    payload: message,
                });

                toast.error(" خطأ ! يرجى المحاولة مرة اخرى بعد تصحيح الاخطاء ", {
                    theme: "colored",
                });
            }
        }
    };
}

export function addProductReset() {
    return { type: ADD_PRODUCT_RESET };
}

// export function handleGetAllProducts ( limit=20,sort='',page,name='' ) {
export function handleGetAllProducts(filterObj = {}, limit = 20, sort = "", page = 1) {
    const { name, category, rating, subCategory } = filterObj;
    // alert(JSON.stringify(filterObj))
    return async (dispatch) => {
        try {
            let url = `/api/products?page=${page}&limit=${limit}`;
            if (sort.trim()) {
                url = `/api/products?page=${page}&limit=${limit}&sort=${sort}`;
            }

            //build url with query string where search
            if (name.trim() || rating.trim()) {
                Object.keys(filterObj).forEach((el) => {
                    // if ( filterObj[el].trim() && el.trim() !== 'category' ) {
                    if (filterObj[el].trim()) {
                        if (el === "rating") {
                            url = `${url}&${el}[gte]=${filterObj[el]}`;
                        } else {
                            url = `${url}&${el}=${filterObj[el]}`;
                        }
                    }
                });
                // } else if (category.trim()) {
            } else {
                //build url with query string where Filter
                url = `/api/products?page=${page}&limit=${limit}&sort=${sort}`;
                Object.keys(filterObj).forEach((el) => {
                    if (filterObj[el].trim()) {
                        if (el === "rating") {
                            url = `${url}&${el}[gte]=${filterObj[el]}`;
                        } else {
                            url = `${url}&${el}=${filterObj[el]}`;
                        }
                    }
                });
            }

            dispatch({ type: GET_PRODUCTS_REQUEST });

            const { data } = await axios.get(url);

            dispatch({
                type: GET_PRODUCTS_SUCCESS,
                payload: data.data.products,
                page: data.data.page,
                count: data.data.count,
                category: data.data.category,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_PRODUCTS_FAIL,
                payload: message,
            });
        }
    };
}

export function handleGetOneProduct(id) {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_ONE_PRODUCT_REQUEST });

            const { data } = await axios.get(`/api/products/${id}`);

            dispatch({
                type: GET_ONE_PRODUCT_SUCCESS,
                payload: data.product,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_PRODUCT_FAIL,
                payload: message,
            });
        }
    };
}

export function handleAddProductSpecification(ProductId, Specification) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: ADD_PRODUCT_SPECIFICATION_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.post(`/api/products/${ProductId}/specifications`, Specification, config);
            dispatch({
                type: ADD_PRODUCT_SPECIFICATION_SUCCESS,
                payload: data.data.product,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: ADD_PRODUCT_SPECIFICATION_FAIL,
                payload: message,
            });
        }
    };
}

export function resetAddSpecification() {
    return { type: ADD_PRODUCT_SPECIFICATION_RESET };
}

export function handleUpdateProduct(productId, newProduct) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: UPDATE_PRODUCT_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.patch(`/api/products/${productId}`, newProduct, config);
            dispatch({
                type: UPDATE_PRODUCT_SUCCESS,
                payload: data.data.product,
            });

            toast.success(" تم تعديل المنتج بنجاح ", {
                theme: "colored",
            });

            dispatch({
                type: GET_ONE_PRODUCT_SUCCESS,
                payload: data.data.product,
            });
        } catch (error) {
            console.log("error.response: ", error.response);
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: UPDATE_PRODUCT_FAIL,
                payload: message,
            });

            toast.error(" خطأ فى تعديل المنتج ", {
                theme: "colored",
            });
        }
    };
}

export function updateProductReset() {
    return { type: UPDATE_PRODUCT_RESET };
}

export function handleUpdateProductSpecification(productId, SpecId, content) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: UPDATE_PRODUCT_SPECIFICATION_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.patch(`/api/products/${productId}/specifications/${SpecId}`, content, config);
            dispatch({
                type: UPDATE_PRODUCT_SPECIFICATION_SUCCESS,
                payload: data.data.product,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: UPDATE_PRODUCT_SPECIFICATION_FAIL,
                payload: message,
            });
        }
    };
}

export function handleGetOneProductSpecification(productId, SpecId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();
            dispatch({ type: GET_ONE_PRODUCT_SPECIFICATION_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data } = await axios.get(`/api/products/${productId}/specifications/${SpecId}`, config);
            console.log("data: ", data);
            dispatch({
                type: GET_ONE_PRODUCT_SPECIFICATION_SUCCESS,
                payload: data.data.specification,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_PRODUCT_SPECIFICATION_FAIL,
                payload: message,
            });
        }
    };
}

//delete product Specification
export function handleDeleteProductSpecification(productId, SpecId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            dispatch({ type: DELETE_PRODUCT_SPECIFICATION_REQUEST });
            await axios.delete(`/api/products/${productId}/specifications/${SpecId}`, config);
            dispatch({
                type: DELETE_PRODUCT_SPECIFICATION_SUCCESS,
            });

            toast.success(`Feature Deleted Successfully`, {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: DELETE_PRODUCT_SPECIFICATION_FAIL,
                payload: message,
            });

            toast.error(`Error while deleting the feature , try again later`, {
                theme: "colored",
            });
        }
    };
}

export function deleteProductSpecificationReset() {
    return { type: DELETE_PRODUCT_SPECIFICATION_RESET };
}

export function getTopProducts() {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_TOP_PRODUCTS_REQUEST });

            const { data } = await axios.get(`/api/products/top`);
            dispatch({
                type: GET_TOP_PRODUCTS_SUCCESS,
                payload: data.data.products,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_TOP_PRODUCTS_FAIL,
                payload: message,
            });
        }
    };
}

export function getRecentProducts(faetures = {}) {
    const { limit } = faetures;
    return async (dispatch) => {
        try {
            dispatch({ type: GET_RECENT_PRODUCTS_REQUEST });

            let link = `/api/products/recent`;
            if (limit) {
                link = `/api/products/recent?limit=${limit}`;
            }
            const { data } = await axios.get(link);
            dispatch({
                type: GET_RECENT_PRODUCTS_SUCCESS,
                payload: data.data.products,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_RECENT_PRODUCTS_FAIL,
                payload: message,
            });
        }
    };
}

export function getRelatedProducts(productId) {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_RELATED_PRODUCTS_REQUEST });

            const { data } = await axios.get(`/api/products/${productId}/related`);
            dispatch({
                type: GET_RELATED_PRODUCTS_SUCCESS,
                payload: data.data.products,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_RELATED_PRODUCTS_FAIL,
                payload: message,
            });
        }
    };
}

export function handleDeleteProduct(productId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            dispatch({ type: DELETE_PRODUCT_REQUEST });
            await axios.delete(`/api/products/${productId}`, config);
            dispatch({
                type: DELETE_PRODUCT_SUCCESS,
            });

            toast.success(`تم حذف المنتج`, {
                theme: "colored",
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: DELETE_PRODUCT_FAIL,
                payload: message,
            });

            toast.success(`حدث خطأ برجاء المحاولة لاحقا`, {
                theme: "colored",
            });
        }
    };
}

export function handleDeleteProductReset() {
    return { type: DELETE_PRODUCT_RESET };
}
