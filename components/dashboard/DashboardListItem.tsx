'use client' 


import { DoneAllSharp, ExpandMore, Verified } from '@mui/icons-material';
import { Collapse, IconButton, IconButtonProps, Divider, ListItemProps, styled, Unstable_Grid2 as Grid } from '@mui/material';
import { DBox, DText, HoverAnimation } from 'components';
import { padding } from 'lib/constants';
import { formatDate } from 'lib/functions';
import { Deal } from 'lib/models';
import * as React from 'react';
import { getTypeLabel } from './DashboardType';
import { ProgressBar } from './ProgressBar';


interface DashboardListItemProps extends ListItemProps {
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
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));


export const DashboardListItem: React.FC<DashboardListItemProps> = (props) => {

    const { deal, expanded: _expanded } = props;

    const [expanded, setExpanded] = React.useState(_expanded ?? false)

    const { id, type, cosigners, metadata, specialClause, primaryParty, secondaryParty } = deal;

    const { sign, term, created, title } = metadata

    return (
        <DBox>
            <Grid container spacing={2} direction='column' display='flex' justifyContent='space-between'>
                <Grid xs={12} container direction='row'>
                    <Grid xs={2}>
                        <DText text={type.toLocaleUpperCase()} variant='subtitle1' />
                    </Grid>
                    <Grid xs={4}>
                        <DText text={title} variant='body1' fontWeight='medium' />
                        <DText text={`Created: ${formatDate(created)}`} variant='caption' />
                    </Grid>
                    <Grid xs={3} display='flex'>
                        <ProgressBar progress='10%' />
                    </Grid>
                    <Grid xs={3} container direction='row' display='flex' justifyContent='end'>
                        <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                            <DText text={formatDate(term)} variant='body1' fontWeight='regular' />
                        </Grid>
                        <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                            <ExpandMoreButton expand={expanded} onClick={e => setExpanded(expanded ? false : true)}>
                                <ExpandMore />
                            </ExpandMoreButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {deal.type === 'iou' &&
                <Collapse in={expanded} unmountOnExit timeout='auto'>
                    <Grid container spacing={2} sx={{ padding }}>
                        <Grid xs={4} container direction='row' sx={{ backgroundColor: 'info' }}>
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
                        <Grid xs={4} container direction='row' sx={{ backgroundColor: 'secondary' }}>
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
                        <Grid xs={4} container direction='row' sx={{ backgroundColor: 'secondary' }}>
                            {
                                cosigners && cosigners.length != 0 &&
                                <>
                                    <Grid xs={6}>
                                        <DText text={
                                            cosigners.length === 1 ?
                                            cosigners[0].name :
                                            `${cosigners[0].name}, ${cosigners[1].name} ${cosigners.length > 2 ? `and ${cosigners.length - 2} others` : ''}`
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
                </Collapse>
            }
        </DBox>
    )
}

