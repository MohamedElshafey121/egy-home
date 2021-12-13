import {
    DASHBOARD_SIDEBAR_MOBILE_OPEN,
    DASHBOARD_SIDEBAR_MOBILE_CLOSE,
    DASHBOARD_SIDEBAR_DESKTOP_TOGGLE,
} from "./dashboardSidebarActionTypes";

const initialStateMobile = {
    open: false,
};

export function dashboardSidebarMobileReducer(state = initialStateMobile, action) {
    switch (action.type) {
        case DASHBOARD_SIDEBAR_MOBILE_OPEN:
            return {
                ...state,
                open: true,
            };
        case DASHBOARD_SIDEBAR_MOBILE_CLOSE:
            return {
                state,
                open: false,
            };
        default:
            return state;
    }
}
