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

const setActionPane = (state: DashboardState, action: PayloadAction<any>) => {

    // replace with async logic

    return updateObject(state, {
        table: {
            activeDealId: action.payload
        }
    }) as DashboardState
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        close_all: state => closeAll(state),
        set_action_pane: (state, action) => setActionPane(state, action)
    }
})

export const { close_all, set_action_pane } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer