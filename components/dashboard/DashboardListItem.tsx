'use client' 


import { DoneAllSharp, ExpandMore, Verified } from '@mui/icons-material';
import { Collapse, IconButton, IconButtonProps, ListItem, ListItemProps, Paper, styled, Unstable_Grid2 as Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { DBox, DText, HoverAnimation } from 'components';
import dayjs from 'dayjs';
import { margin, padding } from 'lib/constants';
import { capitalise, dealProgress, repaymentRange } from 'lib/functions';
import { IOU } from 'lib/models';
import * as React from 'react';
import { ProgressBar } from './ProgressBar';


interface DashboardListItemProps extends ListItemProps {
    deal: IOU
    open: boolean,
    handleExpand: (e: any) => void
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

    const { deal, open, handleExpand } = props;

    const { id, type, cosigner, metadata, specialClause, assetTerms, paymentTerms, primaryParty, secondaryParty } = deal;

    const { amount, details, type: assetType, currency } = assetTerms;

    const { sign, term, created, title } = metadata

    const { loanDate, interest, repayment } = paymentTerms

    const formatDate = (dateStr: string) => {
        let date = dayjs(dateStr)
        
        let diff = date.diff(dayjs(), 'days')

        if (diff === 1) return date.format('[Yesterday at] HH:mm:ss')

        if (diff < 7) return date.format('dddd [at] HH:mm:ss')

        else return date.format('DD/MM/YY [at] HH:mm')
        
    } 

    return (
        <ListItem sx={{ width: '80%', flex: 'auto' }}>
            <HoverAnimation>
                <DBox sx={{ width: '80%' }}>
                    <Grid container spacing={2} display='flex' justifyContent='space-between'>
                        <Grid xs={8}>
                            <DText text={title} variant='body1' fontWeight='medium' />
                            <DText text={`Created: ${formatDate(created)}`} variant='caption' />
                        </Grid>
                        <Grid xs={4} container direction='row'>
                            <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                                <DText text={formatDate(term)} variant='body1' fontWeight='regular' />
                            </Grid>
                            <Grid xs={6} display='flex' justifyContent='space-around' alignItems='center'>
                                <ExpandMoreButton expand={open} onClick={handleExpand}>
                                    <ExpandMore />
                                </ExpandMoreButton>
                            </Grid>
                        </Grid>
                        <Grid xs={12}>
                            <ProgressBar progress='10%' />
                        </Grid>
                    </Grid>
                    
                    {deal.type === 'iou' &&
                    
                        <Collapse in={open} unmountOnExit timeout='auto'>
                            <Grid container spacing={2} sx={{ padding }}>
                                <Grid xs={12}>
                                    <DText text={type.toUpperCase()} fontWeight='medium' variant='h6' />
                                </Grid>
                                <Grid xs={6} container direction='row' sx={{ backgroundColor: 'info' }}>
                                    <Grid xs={6} display='flex' justifyContent='flex-start'>
                                        <DText text={`${primaryParty.name} (Me)`} />
                                    </Grid>
                                    <Grid xs={6} display='flex' justifyContent='flex-end'>
                                        {
                                            primaryParty.signed ?
                                            <Verified fontSize='small' color='success' />
                                            :
                                            <DoneAllSharp fontSize='small' color='primary' />
                                        }
                                    </Grid>
                                </Grid>
                                <Grid xs={6} container direction='row' sx={{ backgroundColor: 'secondary' }}>
                                    <Grid xs={6} display='flex' justifyContent='flex-start'>
                                        <DText text={`${secondaryParty.name}`} />
                                    </Grid>
                                    <Grid xs={6} display='flex' justifyContent='flex-end'>
                                        {
                                            secondaryParty.signed ?
                                            <Verified fontSize='small' color='success' />
                                            :
                                            <DoneAllSharp fontSize='small' color='primary' />
                                        }
                                    </Grid>
                                </Grid>
                                <Grid xs={6}>
                                    
                                </Grid>
                                <Grid xs={6}>
                                    <Paper sx={{ padding }}>
                                        <Stack spacing={1}>
                                            <DText text='Details' fontWeight='regular' />
                                            <div>
                                                <DText text={`${currency} ${amount}`} fontWeight='regular' />
                                                <DText text='Value' variant='caption' />
                                            </div>
                                            <div>
                                                <DText text={capitalise(type)} fontWeight='regular' />
                                                <DText text='Asset Type' variant='caption' />
                                            </div>
                                            <div>
                                                <DText text={details} fontWeight='regular' />
                                                <DText text='Description' variant='caption' />
                                            </div>
                                        </Stack>
                                    </Paper>
                                </Grid>
                                <Grid xs={6}>
                                    <Paper sx={{ padding }}>
                                        <Stack spacing={1}>
                                            <DText text='Payment Terms' fontWeight='regular' />
                                            <div>
                                                <DText text={formatDate(loanDate)} fontWeight='regular' />
                                                <DText text='Loan Date' variant='caption' />
                                            </div>
                                            <div>
                                                <DText text={`${interest.rate}% ${capitalise(interest.type)}, ${interest.frequency}`} fontWeight='regular' />
                                                <DText text='Interest Terms' variant='caption' />
                                            </div>
                                            <div>
                                                <DText text={`${currency} ${repaymentRange(amount, interest.rate)[0]}, ${repayment}`} fontWeight='regular' />
                                                <DText text='Repayments' variant='caption' />
                                            </div>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Collapse>
                    }
                </DBox>
            </HoverAnimation>
        </ListItem>
           
    )
}

