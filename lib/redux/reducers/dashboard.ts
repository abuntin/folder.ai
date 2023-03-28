import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { updateObject } from "lib/functions";


interface DashboardState {
    open: { [key: string]: boolean }
}

const initialState = {
    open: [0, 1, 2].reduce((prev, curr) => { return { ...prev, [curr.toString()]: false }}, {})
} as DashboardState

const closeAll = (state: DashboardState) => {
    return initialState
}

const openOne = (state: DashboardState, action: PayloadAction<any>) => updateObject(state, { open: action.payload }) as DashboardState

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        close_all: state => closeAll(state),
        open_one: (state, action) => openOne(state, action)
    }
})

export const { close_all, open_one } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer