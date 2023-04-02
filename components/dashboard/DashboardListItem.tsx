'use client' 


import { KeyboardArrowRightSharp, EditSharp } from '@mui/icons-material';
import { Box, Button, IconButton, IconButtonProps, BoxProps, styled, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { DText, HoverAnimation } from 'components';
import { padding } from 'lib/constants';
import { formatDate } from 'lib/functions';
import { Deal } from 'lib/models';
import { useAppDispatch, useAppSelector } from 'lib/redux';
import { set_action_pane } from 'lib/redux/reducers';
import * as React from 'react';
import { ProgressBar } from './ProgressBar';


interface DashboardListItemProps extends BoxProps {
    deal: Deal
    expanded?: boolean,
} 

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean
}

interface EditButtonProps extends IconButtonProps {

}

const ExpandMoreButton = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const EditButton = styled((props: EditButtonProps) => {
    const { disabled, ...other } = props;
    return <IconButton {...other} />

})(({ theme, disabled}) => ({
     
}))


export const DashboardListItem: React.FC<DashboardListItemProps> = (props) => {
    const theme = useTheme()

    const dispatch = useAppDispatch()

    const { activeDealId } = useAppSelector(state => state.dashboard.table)

    const [bg, setBg] = React.useState(undefined)

    React.useEffect(() => {

        if (deal.id === activeDealId) setBg('background.paper')

        else setBg(undefined)

    }, [activeDealId])

    const { deal } = props;

    const { id, type, metadata } = deal;

    const { sign, term, created, title } = metadata

    const handleDealActionPane = (e: any) => {
        dispatch(set_action_pane(activeDealId === id ? '' : id))
    }

    return (
        <Box sx={{ backgroundColor: bg, '&:hover': { backgroundColor: 'background.paper'} }}>
            <Grid container spacing={2} direction='column' display='flex' justifyContent='space-between'>
                <Grid xs={12} container direction='row'>
                    <Grid xs={1}>
                        <DText text={type.toLocaleUpperCase()} variant='subtitle1' />
                    </Grid>
                    <Grid xs={3}>
                        <DText text={title} variant='body1' fontWeight='medium' />
                        <DText text={`Created: ${formatDate(created)}`} variant='caption' />
                    </Grid>
                    <Grid xs={5} container direction='row'>
                        <Grid xs={10}>
                            <ProgressBar progress='10%' />
                        </Grid>
                        <Grid xs={2}>
                            <EditButton>
                                <EditSharp />
                            </EditButton>
                        </Grid>
                    </Grid>
                    <Grid xs={3} container direction='row' display='flex' justifyContent='end'>
                        <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                            <DText text={formatDate(term)} variant='body1' fontWeight='regular' />
                        </Grid>
                        <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                            <ExpandMoreButton expand={activeDealId === id} onClick={handleDealActionPane}>
                                <KeyboardArrowRightSharp />
                            </ExpandMoreButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>

    )
}

