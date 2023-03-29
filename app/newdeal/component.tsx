'use client' 


import { Box, FormControl, FormGroup } from '@mui/material'
import { useRouter } from 'next/navigation';

import { DButton, NavAnimation } from 'components'
import { isCompleted } from 'lib/functions'
import { margin } from 'lib/constants'
import * as React from 'react'
import { AssetTypePage, CosignPage, LoanDetailsPage, NewDealProvider, PartyTypePage, PrimaryPartyPage, SecondaryPartyPage, SelectDealPage, TermDetailsPage, useNewDealSelector } from './formPages'


interface NewDealProps {}

const NewDeal: React.FC<NewDealProps> = () => {
    const router = useRouter();

    const children = [
    <SelectDealPage />,
     <PrimaryPartyPage />,
     <SecondaryPartyPage />,
     <PartyTypePage />,
     <AssetTypePage />,
     <CosignPage />,
     <LoanDetailsPage />,
     <TermDetailsPage />
    ]

    const [index, setIndex] = React.useState(0)

    const [disabled, setDisabled] = React.useState(false)

    const state = useNewDealSelector(state => state);

    React.useEffect(() => {
        console.log(state, 'state');

    }, [state, index])

    // React.useEffect(() => {
    //     const [key, formValue] = Object.entries(state)[index]

    //     if (required.includes(key)) {
    //         setDisabled(isCompleted(formValue))
    //     }

    //     else setDisabled(false);
    // }, [state])

    const goForward = (e: any) => setIndex(index + 1)

    const goBack = (e: any) => setIndex(index - 1);

    const onSubmit = (e: any) => { router.push('/dashboard') }

    const renderNavigation = () => {

        return (
            <Box display='flex' flexDirection='row' sx={{ mt: margin * 4, width: '100%', height: '100%' }} justifyContent='space-between'>
                <DButton direction='back' disabled={index === 0} onClick={goBack}> Back </DButton>
                <DButton
                    direction='forward'
                    disabled={disabled}
                    onClick={index === children.length - 1 ? onSubmit : goForward}
                >
                    {index === children.length - 1 ? "Let's Go!" : 'Next'}
                </DButton>
            </Box>
        )
    }

    return (
        <NewDealProvider>
            <Box component='form' onSubmit={onSubmit} display='flex' flexDirection='column' justifyContent='center' alignItems='stretch'>
                <FormControl>
                    <FormGroup row>
                        {
                            children.map((child, i) => (
                                index === i ? (
                                    <NavAnimation key={i}> {child} </NavAnimation>
                                ) : null
                            ))
                        }
                    </FormGroup>
                </FormControl>
                {renderNavigation()}
            </Box>
        </NewDealProvider>
    )
}
 
 

export default NewDeal
