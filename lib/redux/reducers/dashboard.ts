import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { updateObject } from "lib/functions";
import { Deal, sampleIOU } from "lib/models";


interface DashboardState {
    deals: Deal[]
    table: {
        activeDealId: string
    }
}

const initialState = {
    deals: [sampleIOU, {...sampleIOU, id: '2'}, { ...sampleIOU, id: '3'}],
    table: {
        activeDealId: ''
    }
} as DashboardState

const closeAll = (state: DashboardState) => {
    return initialState
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        close_all: state => closeAll(state),
    }
})

export const { close_all } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer