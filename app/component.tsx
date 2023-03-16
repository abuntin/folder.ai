'use client' 


import { Autocomplete, Box, BoxProps, FormControl, FormGroup, TextField } from '@mui/material'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import * as React from 'react' 
import { DButton } from 'components'
import { padding, margin } from 'lib/magic'
import { PrimaryPartyPage, SelectDealPage } from './components'


const children = [<SelectDealPage />, <PrimaryPartyPage />]

interface NewDealProps extends BoxProps {
    
} 

const NewDeal: React.FC<NewDealProps> = () => {

    
    const helloRef = React.useRef<HTMLDivElement>(null);
    
    const goodbyeRef = React.useRef<HTMLDivElement>(null);

    const [state, setState] = React.useState(false)

    const nodeRef = state ? helloRef : goodbyeRef;




    // const element1Ref = React.useRef<HTMLDivElement>(null)
    // const element2Ref = React.useRef<HTMLDivElement>(null)

    const [index, setIndex] = React.useState(0)

    const refs = children.map(child => React.useRef<HTMLDivElement>(null))

    const ref = refs[index] //index === 0 ? element1Ref : element2Ref

    const goForward = (e: any) => { setIndex(index + 1)}

    const goBack = (e: any) => setIndex(index - 1);

    const onSubmit = (e: any) => {}

    const renderNavigation = () => {

        return (
            <Box display='flex' flexDirection='row' sx={{ padding, marginTop: margin * 2 }} justifyContent='space-between'>
                <DButton nav direction='back' disabled={index === 0} onClick={goBack}> Back </DButton>
                <DButton nav direction='forward' disabled={index === 1} onClick={index === 1 ? onSubmit : goForward}> Next </DButton>
            </Box>
        )
    }

    return (
        <Box component='form' onSubmit={onSubmit}>
            <FormControl>
                <FormGroup row>
                    <SwitchTransition mode='out-in'>
                        <CSSTransition
                            key={index}
                            nodeRef={ref}
                            //unmountOnExit={false}
                            addEndListener={done => ref?.current?.addEventListener('transitionend', done, false)}
                            classNames='fade'
                        >
                            <div ref={ref}>
                                {index === 0 && children[0]}
                                {index === 1 && children[1]}
                            </div>
                            
                        </CSSTransition>
                    </SwitchTransition>
                    {/* <SwitchTransition mode='out-in'>
                        <CSSTransition
                            key={state ? "Goodbye, world!" : "Hello, world!"}
                            nodeRef={nodeRef}
                            addEndListener={(done) => {
                                nodeRef?.current?.addEventListener("transitionend", done, false);
                            }}
                            classNames="fade"
                        >
                            <div ref={nodeRef}>
                                <DButton onClick={() => setState((state) => !state)}>
                                    {state ? "Hello, world!" : "Goodbye, world!"}
                                </DButton>
                            </div>
                        </CSSTransition>
                    </SwitchTransition> */}
                </FormGroup>
            </FormControl>
            {renderNavigation()}
        </Box>
    )
}
 
 

export default NewDeal
