'use client' 


import * as React from 'react' 
import { List, ListProps } from '@mui/material'
import { DashboardListItem } from './DashboardListItem'
import { sampleIOU } from 'lib/models'
import { useAppDispatch, useAppSelector } from 'lib/redux'
import { open_one } from 'lib/redux/reducers'

interface DashboardListProps extends ListProps {
} 

export const DashboardList: React.FC<DashboardListProps> = (props) => {

    const { open } = useAppSelector(state => state.dashboard)

    const dispatch = useAppDispatch();

    const handleClick = (e: any, index: string) => {

        let newOpen = Object.keys(open).reduce((prev, curr) => {
            if (curr === index) return { ...prev, [curr]: open[curr] ? false : true }
            
            else return { ...prev, [curr]: !open[index] ? false : open[curr] }

        }, {})

        dispatch(open_one(newOpen))
    }

    return (
       <List sx={{ width: '100%', height: '100%' }}>
            {
                [0, 1, 2].map(_ => (
                    <DashboardListItem key={_} deal={sampleIOU} open={open[_.toString()]} handleExpand={e => handleClick(e, _.toString())} />
                ))
            } 
       </List>
    )
}