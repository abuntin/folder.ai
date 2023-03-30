'use client' 


import { useAppSelector } from 'lib/redux'
import * as React from 'react' 
import { Unstable_Grid2 as Grid } from '@mui/material'
import { DashboardList } from './DashboardList'
import { ActionPane } from './ActionPane'


interface DealViewProps {
    
} 

export const DealView: React.FC<DealViewProps> = (props) => {

    const { table: { activeDealId }, deals } = useAppSelector(state => state.dashboard)


    return (
       <Grid container> 
            <Grid xs={12}>
                <DashboardList />
            </Grid>
       </Grid>
    )
}