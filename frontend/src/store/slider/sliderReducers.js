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

function getAllSliderItemsReducer(state = {}, action) {
    switch (action.type) {
        case GET_ALL_SLIDER_ITEMS_REQUEST:
            return { loading: true };
        case GET_ALL_SLIDER_ITEMS_SUCCESS:
            return { loading: false, success: true, sliders: action.payload };
        case GET_ALL_SLIDER_ITEMS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

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

function editSliderItemReducer(state = {}, action) {
    switch (action.type) {
        case EDIT_SLIDER_ITEM_REQUEST:
            return { loading: true };
        case EDIT_SLIDER_ITEM_SUCCESS:
            return { loading: false, success: true };
        case EDIT_SLIDER_ITEM_FAIL:
            return { loading: false, error: action.payload };
        case EDIT_SLIDER_ITEM_RESET:
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

function getOneSliderItemReducer(state = {}, action) {
    switch (action.type) {
        case GET_ONE_SLIDER_REQUEST:
            return { loading: true };
        case GET_ONE_SLIDER_SUCCESS:
            return { loading: false, success: true, slider: action.payload };
        case GET_ONE_SLIDER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export {
    addSliderItemReducer,
    deleteSliderItemReducer,
    editSliderItemReducer,
    getAllSliderItemsReducer,
    getOneSliderItemReducer,
};
