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

    const [active, setActive] = React.useState(null)

    React.useEffect(() => {

        const _deal = activeDealId === '' ? null : deals.filter(deal => deal.id === activeDealId)[0]

        setActive(_deal)

    }, [activeDealId])


    return (
       <Grid container> 
            <Grid xs={activeDealId !== '' ? 7 : 12}>
                <DashboardList deals={deals} />
            </Grid>

            {
                activeDealId !== '' && active &&
                <Grid xs={5}>
                    <ActionPane deal={active} open={activeDealId !== '' && active} />
                </Grid>
            }
       </Grid>
    )
}