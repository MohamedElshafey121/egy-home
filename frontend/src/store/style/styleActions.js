import { CHANGE_STYLE } from "./styleActionTypes";

export function changeStyle(site) {
    return {
        type: CHANGE_STYLE,
        payload: site,
    };
}
