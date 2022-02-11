import axios from "axios";
import {
    ADD_SLIDER_ITEM_REQUEST,
    ADD_SLIDER_ITEM_SUCCESS,
    ADD_SLIDER_ITEM_FAIL,
    ADD_SLIDER_ITEM_RESET,
    EDIT_SLIDER_ITEM_REQUEST,
    EDIT_SLIDER_ITEM_SUCCESS,
    EDIT_SLIDER_ITEM_FAIL,
    EDIT_SLIDER_ITEM_RESET,
    DELETE_SLIDER_ITEM_REQUEST,
    DELETE_SLIDER_ITEM_SUCCESS,
    DELETE_SLIDER_ITEM_FAIL,
    DELETE_SLIDER_ITEM_RESET,
    GET_ALL_SLIDER_ITEMS_REQUEST,
    GET_ALL_SLIDER_ITEMS_SUCCESS,
    GET_ALL_SLIDER_ITEMS_FAIL,
    GET_ONE_SLIDER_REQUEST,
    GET_ONE_SLIDER_SUCCESS,
    GET_ONE_SLIDER_FAIL,
} from "./sliderActiontypes";

function getAllSliderItemsHandler() {
    return async (dispatch) => {
        try {
            dispatch({ type: GET_ALL_SLIDER_ITEMS_REQUEST });

            const { data } = await axios.get("/api/sliders");
            dispatch({ type: GET_ALL_SLIDER_ITEMS_SUCCESS, payload: data.sliders });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ALL_SLIDER_ITEMS_FAIL,
                payload: message,
            });
        }
    };
}

function addSliderItemHandler(sliderData) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            dispatch({ type: ADD_SLIDER_ITEM_REQUEST });

            await axios.post("/api/sliders", sliderData, config);
            dispatch({ type: ADD_SLIDER_ITEM_SUCCESS });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: ADD_SLIDER_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

function resetAddSliderItem() {
    return { type: ADD_SLIDER_ITEM_RESET };
}

function editSliderItemHandler(sliderId, sliderData) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            dispatch({ type: EDIT_SLIDER_ITEM_REQUEST });

            await axios.patch(`/api/sliders/${sliderId}`, sliderData, config);
            dispatch({ type: EDIT_SLIDER_ITEM_SUCCESS });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: EDIT_SLIDER_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

function resetEditSliderItem() {
    return { type: EDIT_SLIDER_ITEM_RESET };
}

function deleteSliderItemHandler(sliderId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Cype": "multipart/form-data",
                },
            };

            dispatch({ type: DELETE_SLIDER_ITEM_REQUEST });

            await axios.delete(`/api/sliders/${sliderId}`, config);
            dispatch({ type: DELETE_SLIDER_ITEM_SUCCESS });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: DELETE_SLIDER_ITEM_FAIL,
                payload: message,
            });
        }
    };
}

function resetDeleteSliderItem() {
    return { type: DELETE_SLIDER_ITEM_RESET };
}

function getOneSliderItemHandler(sliderId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            dispatch({ type: GET_ONE_SLIDER_REQUEST });

            const { data } = await axios.get(`/api/sliders/${sliderId}`, config);
            dispatch({ type: GET_ONE_SLIDER_SUCCESS, payload: data.slider });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ONE_SLIDER_FAIL,
                payload: message,
            });
        }
    };
}

export {
    addSliderItemHandler,
    resetAddSliderItem,
    deleteSliderItemHandler,
    resetDeleteSliderItem,
    editSliderItemHandler,
    resetEditSliderItem,
    getAllSliderItemsHandler,
    getOneSliderItemHandler,
};
