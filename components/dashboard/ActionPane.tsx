'use client' 


import { Unstable_Grid2 as Grid, Paper, Stack, Collapse, IconButton, Divider } from '@mui/material'
import { padding } from 'lib/constants'
import { DButton, DText } from 'components/common'
import { capitalise, formatDate, repaymentRange } from 'lib/functions'
import { IOU } from 'lib/models'
import * as React from 'react' 
import { useAppDispatch, useAppSelector } from 'lib/redux'
import { CloseSharp, DoneAllSharp, Verified } from '@mui/icons-material'
import { set_action_pane } from 'lib/redux/reducers'
import { Party } from 'lib/types'
import { getCosignersStatus, getPartyStatus } from './DashboardType'


interface ActionPaneProps {
    deal: IOU,
    open?: boolean
} 

export const ActionPane: React.FC<ActionPaneProps> = (props) => {

    const { deal, open } = props

    const dispatch = useAppDispatch()

    const closeActionPane = (e: any) => {
        dispatch(set_action_pane(''))
    }

    const { id, type, cosigners, metadata, specialClause, assetTerms, paymentTerms, primaryParty, secondaryParty } = deal;

    const { amount, details, type: assetType, currency } = assetTerms;

    const { sign, term, created, title } = metadata

    const { loanDate, interest, repayment } = paymentTerms


    const renderParty = React.useCallback((party: Party) => {

        return (
            <Grid xs={12} container spacing={2} direction='row'>
                <Grid xs={6}>
                    <DText text={`${party.name}`} /> {getPartyStatus(party)}
                </Grid>
                <Grid xs={6}>
                    <DText text={`${party.email}`} />
                </Grid>
            </Grid>
        )
    }, [primaryParty, secondaryParty])


    const renderActions = () => (
        <Grid xs={12} container spacing={2}>
            {
                [{ text: 'Raise Issue', color: 'secondary' }, { text: 'Share', color: 'success' }, { text: 'Editor', color: 'primary' },].map(({ text, color }) => (
                    <Grid xs={4}>
                        <DButton direction={ text === 'Editor' ? 'forward' : undefined} color={color as "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}>
                            <DText text={text} />
                        </DButton>
                    </Grid>
                ))
            }

        </Grid>
    )
    
    return (
        <Collapse in={open ?? true} unmountOnExit timeout='auto'>
            <Grid container spacing={2} sx={{ padding }}>
                <Grid xs display='flex' justifyContent='end'>
                    <IconButton onClick={closeActionPane}>
                        <CloseSharp />
                    </IconButton>
                </Grid>
                <Grid xs={12} container>
                    <Grid xs={2}>
                        <DText text={type.toUpperCase()} fontWeight='medium' variant='subtitle1' />
                    </Grid>
                    <Grid xs={6} display='flex' justifyContent='center'>
                        <DText text={title} fontWeight='regular' variant='h6' />
                    </Grid>
                </Grid>
                <Grid xs={12}>
                    <DText text='Deal Parties' />   
                </Grid>
                <Grid xs={12} container spacing={2} sx={{ padding }} direction='column'>
                    {renderParty(primaryParty)}
                    {renderParty(secondaryParty)}
                </Grid>
                <Grid xs={12}>
                    <DText text='Other Signatories' />   
                </Grid>
                <Grid xs={12} container spacing={2} sx={{ padding }} direction='column'>
                    {
                        cosigners && cosigners.length !== 0 && cosigners.map(party => (
                            renderParty(party)
                        ))
                    }
                </Grid>
                <Grid xs={4} container>
                    <Grid xs={12}>
                        <DText text='Details' />   
                    </Grid>
                    <Grid xs={12}>
                        <Paper sx={{ padding }}>
                            <Stack spacing={1}>
                                <div>
                                    <DText text='Value' variant='caption' />
                                    <DText text={`${currency} ${amount}`} fontWeight='regular' />
                                </div>
                                <div>
                                    <DText text='Asset Type' variant='caption' />
                                    <DText text={capitalise(type)} fontWeight='regular' />
                                </div>
                                <div>
                                    <DText text='Description' variant='caption' />
                                    <DText text={details} fontWeight='regular' />
                                </div>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid xs={4} container>
                    <Grid xs={12}>
                        <DText text='Terms' />   
                    </Grid>
                    <Grid xs={12}>
                        <Paper sx={{ padding }}>
                            <Stack spacing={1}>
                                <div>
                                    <DText text='Loan Date' variant='caption' />
                                    <DText text={formatDate(loanDate)} fontWeight='regular' />
                                    
                                </div>
                                <div>
                                    <DText text='Interest Terms' variant='caption' />
                                    <DText text={`${interest.rate}% ${capitalise(interest.type)}, ${interest.frequency}`} fontWeight='regular' />
                                    
                                </div>
                                <div>
                                    <DText text='Repayments' variant='caption' />
                                    <DText text={`${currency} ${repaymentRange(amount, interest.rate)[0]}, ${repayment}`} fontWeight='regular' />
                                </div>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid xs={12}>
                    <DText text='Actions' />   
                </Grid>
                {renderActions()}
            </Grid>
        </Collapse>  
    )
}