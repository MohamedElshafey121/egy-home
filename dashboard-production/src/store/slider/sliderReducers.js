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

function addSliderItemReducer(state = {}, action) {
    switch (action.type) {
        case ADD_SLIDER_ITEM_REQUEST:
            return { loading: true };
        case ADD_SLIDER_ITEM_SUCCESS:
            return { loading: false, success: true };
        case ADD_SLIDER_ITEM_FAIL:
            return { loading: false, error: action.payload };
        case ADD_SLIDER_ITEM_RESET:
            return {};
        default:
            return state;
    }
}

function deleteSliderItemReducer(state = {}, action) {
    switch (action.type) {
        case DELETE_SLIDER_ITEM_REQUEST:
            return { loading: true };
        case DELETE_SLIDER_ITEM_SUCCESS:
            return { loading: false, success: true };
        case DELETE_SLIDER_ITEM_FAIL:
            return { loading: false, error: action.payload };
        case DELETE_SLIDER_ITEM_RESET:
            return {};
        default:
            return state;
    }
}

export { addSliderItemReducer, deleteSliderItemReducer };
