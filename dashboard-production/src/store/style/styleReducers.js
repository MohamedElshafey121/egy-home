import { CHANGE_STYLE } from "./styleActionTypes";

//true=site ,false=dashboard
export default function styleReducer(state = { site: true }, action) {
    if (action.type === CHANGE_STYLE) {
        return { site: action.payload };
    }
    return state;
}
