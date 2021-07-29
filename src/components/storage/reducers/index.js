import { combineReducers } from "redux";

import goalsReducer from "./goalsReducer";

export default combineReducers({
    goals: goalsReducer
})