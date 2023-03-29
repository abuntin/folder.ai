'use client' 


import { DoneAllSharp, KeyboardArrowRightSharp, Verified } from '@mui/icons-material';
import { Box, Collapse, IconButton, IconButtonProps, BoxProps, styled, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { DText, HoverAnimation } from 'components';
import { padding } from 'lib/constants';
import { formatDate } from 'lib/functions';
import { Deal } from 'lib/models';
import { useAppDispatch } from 'lib/redux';
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

const ExpandMoreButton = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(360deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));


export const DashboardListItem: React.FC<DashboardListItemProps> = (props) => {

    const dispatch = useAppDispatch()

    const { deal, expanded: _expanded } = props;

    const [expanded, setExpanded] = React.useState(_expanded ?? false)

    const { id, type, cosigners, metadata, specialClause, primaryParty, secondaryParty } = deal;

    const { sign, term, created, title } = metadata

    const handleDealActionPane = (e: any) => {
        dispatch(set_action_pane(deal.id))
    }

    return (
        <Box>
            <Grid container spacing={2} direction='column' display='flex' justifyContent='space-between'>
                <Grid xs={12} container direction='row'>
                    <Grid xs={1}>
                        <DText text={type.toLocaleUpperCase()} variant='subtitle1' />
                    </Grid>
                    <Grid xs={3}>
                        <DText text={title} variant='body1' fontWeight='medium' />
                        <DText text={`Created: ${formatDate(created)}`} variant='caption' />
                    </Grid>
                    <Grid xs={5}>
                        <ProgressBar progress='10%' />
                        <Grid container spacing={2} sx={{ padding }}>
                            <Grid xs={4} container direction='row'>
                                <Grid xs={6} display='flex' justifyContent='center'>
                                    <DText text={`${primaryParty.name} (Me)`} />
                                </Grid>
                                <Grid xs={6} display='flex' justifyContent='center'>
                                    {
                                        primaryParty.signed ?
                                        <Verified fontSize='small' color='success' />
                                        :
                                        <DoneAllSharp fontSize='small' color='primary' />
                                    }
                                </Grid>
                            </Grid>
                            <Grid xs={4} container direction='row'>
                                <Grid xs={6} display='flex' justifyContent='center'>
                                    <DText text={`${secondaryParty.name}`} />
                                </Grid>
                                <Grid xs={6} display='flex' justifyContent='center'>
                                    {
                                        secondaryParty.signed ?
                                        <Verified fontSize='small' color='success' />
                                        :
                                        <DoneAllSharp fontSize='small' color='primary' />
                                    }
                                </Grid>
                            </Grid>
                            <Grid xs={4} container direction='row'>
                            {
                                cosigners && cosigners.length != 0 &&
                                <>
                                    <Grid xs={6}>
                                        <DText text={
                                            cosigners.length === 1 ?
                                            cosigners[0].name :
                                            `${cosigners[0].name} + ${cosigners.length - 1} more`
                                        } />
                                    </Grid>
                                    <Grid xs={6} display='flex' justifyContent='center'>
                                        {
                                            ((cosigners.length === 1 && cosigners[0].signed) || cosigners.reduce((prev, curr) => prev && curr.signed, true)) ?
                                                <Verified fontSize='small' color='success' />
                                                :
                                                <DoneAllSharp fontSize='small' color='primary' />
                                        }
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                    </Grid>
                    <Grid xs={3} container direction='row' display='flex' justifyContent='end'>
                        <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                            <DText text={formatDate(term)} variant='body1' fontWeight='regular' />
                        </Grid>
                        <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                            <ExpandMoreButton expand={expanded} onClick={handleDealActionPane}>
                                <KeyboardArrowRightSharp />
                            </ExpandMoreButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

