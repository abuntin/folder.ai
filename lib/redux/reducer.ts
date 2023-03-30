import { AnyAction, combineReducers, Reducer } from "@reduxjs/toolkit";
import { dashboardReducer } from "./reducers";

export const reducer = combineReducers({
    dashboard: dashboardReducer,
});



