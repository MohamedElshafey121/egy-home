import axios from "axios";
import {
    ADD_SLIDER_ITEM_REQUEST,
    ADD_SLIDER_ITEM_SUCCESS,
    ADD_SLIDER_ITEM_FAIL,
    ADD_SLIDER_ITEM_RESET,
    DELETE_SLIDER_ITEM_REQUEST,
    DELETE_SLIDER_ITEM_SUCCESS,
    DELETE_SLIDER_ITEM_FAIL,
    DELETE_SLIDER_ITEM_RESET,
} from "./sliderActiontypes";

function addSliderItemHandler(sliderData) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.jwt}`,
                    "Content-Cype": "multipart/form-data",
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

function deleteSliderItemHandler(sliderId) {
    return async (dispatch, getState) => {
        try {
            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.jwt}`,
                    "Content-Cype": "multipart/form-data",
                },
            };

            dispatch({ type: DELETE_SLIDER_ITEM_REQUEST });

            await axios.post(`/api/sliders/${sliderId}`, config);
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

export { addSliderItemHandler, resetAddSliderItem, deleteSliderItemHandler, resetDeleteSliderItem };
