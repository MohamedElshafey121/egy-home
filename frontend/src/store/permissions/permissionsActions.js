import axios from "axios";
import { toast } from "react-toastify";
import {
    GET_ALL_PERMISSIONS_REQUEST,
    GET_ALL_PERMISSIONS_SUCCESS,
    GET_ALL_PERMISSIONS_FAIL,
} from "./permissionsActionsTypes";

function getAllPermissions() {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: GET_ALL_PERMISSIONS_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get("/api/permissions", config);

            return dispatch({
                type: GET_ALL_PERMISSIONS_SUCCESS,
                payload: data.data.permissions,
            });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;

            dispatch({
                type: GET_ALL_PERMISSIONS_FAIL,
                payload: message,
            });
            toast.error("خطأ فى التحميل يرجى المحاولة مرة اخرى", {
                theme: "colored",
            });
        }
    };
}

export { getAllPermissions };
