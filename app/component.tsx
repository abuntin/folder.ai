'use client' 


import { Box, FormControl, FormGroup } from '@mui/material'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import * as React from 'react' 
import { DButton } from 'components'
import { padding, margin } from 'lib/magic'
import { PrimaryPartyPage, SelectDealPage, SecondaryPartyPage, NewDealContext } from './components'
import { FormValueType } from 'lib/types'


interface NewDealProps {}

const NewDeal: React.FC<NewDealProps> = () => {

    const children = [<SelectDealPage />, <PrimaryPartyPage />, <SecondaryPartyPage />]

    const [index, setIndex] = React.useState(0)

    const refs = children.map(child => React.useRef<HTMLDivElement>(null))

    const ref = refs[index]

    const [fields, setFields] = React.useState({
        selectDealPage: '',
        primaryPartyPage: {
            name: '',
            country: ''
        },
        secondaryPartyPage: {
            name: '',
            country: ''
        }
    })

    React.useEffect(() => {
        console.log(fields);
    }, [fields])

    const goForward = (e: any) => { setIndex(index + 1)}

    const goBack = (e: any) => setIndex(index - 1);

    const save = (key: string, value: FormValueType) => {
        setFields({ ...fields, [key]: value})
    }

    const onSubmit = (e: any) => {}

    const renderNavigation = () => {

        return (
            <Box display='flex' flexDirection='row' sx={{ padding, margin: margin * 3 }} justifyContent='space-between'>
                <DButton direction='back' disabled={index === 0} onClick={goBack}> Back </DButton>
                <DButton direction='forward' disabled={index === children.length - 1} onClick={index === children.length - 1 ? onSubmit : goForward}> Next </DButton>
            </Box>
        )
    }

    return (
        <NewDealContext.Provider value={{ save }}>
            <Box component='form' onSubmit={onSubmit}>
                <FormControl>
                    <FormGroup row>
                        <SwitchTransition mode='out-in'>
                            <CSSTransition
                                key={index}
                                nodeRef={ref}
                                addEndListener={done => ref?.current?.addEventListener('transitionend', done, false)}
                                classNames='fade'
                            >
                                <div ref={ref}>
                                    {
                                        children.map((child, i) => (
                                            index === i && <React.Fragment key={i}> {child} </React.Fragment>
                                        ))
                                    }
                                </div>
                            </CSSTransition>
                        </SwitchTransition>
                    </FormGroup>
                </FormControl>
                {renderNavigation()}
            </Box>
        </NewDealContext.Provider>
    )
}
 
 

export default NewDeal
