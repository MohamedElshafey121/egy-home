import {
    DASHBOARD_SIDEBAR_MOBILE_OPEN,
    DASHBOARD_SIDEBAR_MOBILE_CLOSE,
    DASHBOARD_SIDEBAR_DESKTOP_TOGGLE,
} from "./dashboardSidebarActionTypes";

export function dashboardSidebarMobileOpen() {
    return { type: DASHBOARD_SIDEBAR_MOBILE_OPEN };
}

export function dashboardSidebarMobileClose() {
    return { type: DASHBOARD_SIDEBAR_MOBILE_CLOSE };
}

export function dashboardSideBarDesktopToggle() {
    return { type: DASHBOARD_SIDEBAR_DESKTOP_TOGGLE };
}
