'use client' 


import { Grid, Paper, Stack } from '@mui/material'
import { padding } from 'lib/constants'
import { DText } from 'components/common'
import { capitalise, formatDate, repaymentRange } from 'lib/functions'
import { IOU } from 'lib/models'
import * as React from 'react' 


interface ActionPaneProps {
    deal: IOU
} 

export const ActionPane: React.FC<ActionPaneProps> = (props) => {

    const { deal } = props

    const { id, type, cosigners, metadata, specialClause, assetTerms, paymentTerms, primaryParty, secondaryParty } = deal;

    const { amount, details, type: assetType, currency } = assetTerms;

    const { sign, term, created, title } = metadata

    const { loanDate, interest, repayment } = paymentTerms
    
    return (
        <Grid container spacing={2} sx={{ padding }}>
            <Grid xs={12}>
                <DText text={type.toUpperCase()} fontWeight='medium' variant='h6' />
            </Grid>
            <Grid xs={6}>
                <Paper sx={{ padding }}>
                    <Stack spacing={1}>
                        <DText text='Details' fontWeight='regular' />
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
            <Grid xs={6}>
                <Paper sx={{ padding }}>
                    <Stack spacing={1}>
                        <DText text='Payment Terms' fontWeight='regular' />
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
    )
}