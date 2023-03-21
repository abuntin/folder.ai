'use client'


import { FormControlLabel, Grid } from '@mui/material'
import { CSSTransition } from 'react-transition-group'
import { margin } from 'lib/magic'
import { key, keys, headings, labels } from './text';
import { DText, DCheckbox, DInput } from 'components'
import * as React from 'react' 
import { useNewDealDispatch, useNewDealSelector } from '../..';


interface CosignPageProps {}

const { heading, subheading, info } = headings;
const { name: nameKey, address: addressKey, city: cityKey } = keys;
const { name: nameLabel, address: addressLabel } = labels;

export const CosignPage: React.FC<CosignPageProps> = () => {

    const { [key]: state } = useNewDealSelector(state => state)

    const dispatch = useNewDealDispatch()

    const nodeRef = React.useRef<HTMLDivElement>(null);

    const [fields, setFields] = React.useState(state)

    const handleChange = (e: any, field: string, newVal?: boolean) => {
          const newFields = { ...fields, [field]: newVal ?? e.target.value } 
          setFields(newFields) 
          dispatch({ [key]: newFields })
     }

    return (
        <Grid container spacing={4}>
            {heading !== '' && 
             <Grid item xs={12} sx={{ mb: margin }}>
                <DText text={heading} variant='h5' />
            </Grid>
          }
            <Grid item xs={12}>
                <FormControlLabel
                    control={<DCheckbox value={fields.isCosigned} onChange={e => handleChange(e, 'isCosigned', e.target.checked)} />}
                    label={<DText text={subheading} variant='body1' />}
                    labelPlacement='end'
                />
            </Grid>
            <Grid item xs={12} sx={{ mb: margin * 2 }}>
                <CSSTransition
                    in={fields.isCosigned}
                    nodeRef={nodeRef}
                    classNames="hideshow"
                    addEndListener={done => nodeRef?.current?.addEventListener('transitionend', done, false)}
                >
                    <div ref={nodeRef}>
                        {fields.isCosigned && 
                            <>
                        
                                

                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <DText text={nameLabel} variant='body2' />
                                </Grid>
                                <Grid item xs={12}>
                                    <DInput
                                        placeholder={nameKey.charAt(0).toUpperCase() + nameKey.slice(1)}
                                        value={fields[nameKey]}
                                        onChange={e => handleChange(e, nameKey)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DText text={addressLabel} variant='body2' />
                                </Grid>
                                <Grid item xs={12}>
                                    <DInput
                                        placeholder={`${addressKey.charAt(0).toUpperCase() + addressKey.slice(1)} & Postcode`}
                                        value={fields[addressKey]}
                                        onChange={e => handleChange(e, addressKey)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DInput
                                        placeholder={cityKey.charAt(0).toUpperCase() + cityKey.slice(1)}
                                        value={fields[cityKey]}
                                        onChange={e => handleChange(e, cityKey)}
                                    />
                                </Grid>
                            </Grid>
                            </>
                        }
                    </div>
                </CSSTransition>
            </Grid>
            <Grid item xs={12}>
                <DText text={info} variant='caption' />
            </Grid>
            
        </Grid>
       
    )
} 