// 'use client' 

export {}

// import { RadioGroup, FormControlLabel, Radio, FormControlLabelProps, FormGroup } from '@mui/material'
// import { padding } from 'lib/magic'
// import { FormOptionType } from 'lib/types'
// import * as React from 'react' 
// import { DBox, DText } from 'components'



// export const FormRadio: React.FC<FormQuestionProps> = (props) => {

//     const { question } = props

//     const [selected, setSelected] = React.useState<FormOptionType | null>(null)

//     const handleChange = (e: any, option: FormOptionType) => {
//         onChange(e, question.key, option) 
//         setSelected(selected)
//     }

//     const renderOptions = () => ( 
//         question.options.map((option, i) => {
//             return (
//                 // TODO: Add tooltips to options via option.description
//                 <DBox key={i}>
//                         <OptionLabel option={option} control={<Radio />} label={option.label} onChange={e => handleChange(e, option)} />
//                 </DBox>
//             )
//         })
//     )

//     return (
//         <FormGroup>
//             <DText text={question.prompt} fontWeight='regular' />
//             <DBox sx={{ padding }}>
//                 <RadioGroup
//                     defaultValue="nda"
//                 >
//                     {renderOptions()}
//                 </RadioGroup>  
//             </DBox>
//             <DText text={`(Tip: ${question.info})`} variant='caption' />
//         </FormGroup>
        
    
//     )
// }

// interface OptionLabelProps extends FormControlLabelProps { 
//     option: FormOptionType
// }
    
// const OptionLabel: React.FC<OptionLabelProps> = ({ option }) => (
//     <FormControlLabel
//         value={option.value} 
//         control={<Radio />}
//         label={<DText text={option.label} variant='body2' />}
//     />
// )