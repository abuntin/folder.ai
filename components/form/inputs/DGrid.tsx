'use client' 


import * as React from 'react' 
import { Box, Button, ButtonProps, Grid } from '@mui/material'
import { margin, padding } from 'lib/magic'
import { FormOptionType } from 'lib/types'
import { DText } from '../../common/DText'


interface DGridProps {
    options: FormOptionType[]
    onChange?: (e: any, selected: FormOptionType) => void
} 

export const DGrid: React.FC<DGridProps> = (props) => {
    
    const { options, onChange } = props;

    const [selected, setSelected] = React.useState<FormOptionType>(options[0]);

    const handleClick = (e: any, option: FormOptionType) => {
        if (onChange) onChange(e, selected)
        setSelected(option)
    }

    interface OptionButtonProps extends ButtonProps {
        option: FormOptionType
    }
    
    
    const OptionButton: React.FC<OptionButtonProps> = ({ option }) => {
    
        const [variant, setVariant] = React.useState<'text' | 'outlined'>('text');

        React.useEffect(() => {

            if (selected.value === option.value) setVariant('outlined')

            else setVariant('text')

        }, [selected])
        
        return (
            <Box display='flex' flexDirection='row' justifyContent='space-evenly'>
                <Button
                    variant={variant}
                    onClick={e => handleClick(e, option)}
                    sx={{ maxWidth: 200 }}
                >
                    <DText text={option.label} variant='caption' color='primary' />
                </Button>
            </Box>
            
        )
    }

    return (
        <Box sx={{ flexGrow: 1, padding }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    
                    {
                        options.map((option, i) => (
                            <Grid item xs={2} sm={4} md={4} key={i}>
                                <OptionButton key={i} option={option}  />
                            </Grid>
                            
                        ))
                        
                    }
            </Grid>
        </Box>
    )
}

