'use client' 


import * as React from 'react' 
import { Settings } from '@mui/icons-material'
import { animated, useSpring } from 'react-spring'

interface DealEngineLogoProps {
    
} 

const AnimatedSettings = animated(Settings)

export const DealEngineLogo: React.FC<DealEngineLogoProps> = (props) => {
    const { rotate } = useSpring({
        from: { rotate: 0 },
        to: { rotate: 1 },
        loop: { reverse: true },
        config: { duration: 1500 }
    })

    return (
       <AnimatedSettings style={{ rotate: rotate.to([0, 1], ['0deg', '360deg']) }} />
    )
}